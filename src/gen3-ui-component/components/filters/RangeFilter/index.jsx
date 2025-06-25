import { forwardRef, useImperativeHandle, useState } from 'react';
import PropTypes from 'prop-types';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import './RangeFilter.css';
import Button from '../../Button/index';
import UnitCalculator from './UnitCalculator/UnitCalculator';

/**
 * @callback AfterDragHandler
 * @param {number} lowerBound
 * @param {number} upperBound
 * @param {number} min
 * @param {number} max
 * @param {number} rangeStep
 */

const RangeFilter = forwardRef(
  /**
   * @param {Object} props
   * @param {number} [props.count]
   * @param {number} [props.decimalDigitsLen]
   * @param {number} [props.hideValue]
   * @param {boolean} [props.inactive]
   * @param {string} [props.label]
   * @param {number} [props.lowerBound]
   * @param {number} props.max
   * @param {number} props.min
   * @param {AfterDragHandler} props.onAfterDrag
   * @param {number} [props.upperBound]
   * @param {number} [props.rangeStep]
   * @param {React.Ref<any>} [ref]
   */
  // eslint-disable-next-line prefer-arrow-callback
  function RangeFilter(props, ref) {
    const {
      count = 0,
      decimalDigitsLen = 2,
      hideValue = -1,
      inactive = false,
      label = '',
      lowerBound,
      max,
      min,
      onAfterDrag,
      upperBound,
      rangeStep = 1,
    } = props;

    const [range, setRange] = useState({
      lowerBound: lowerBound > min ? lowerBound : min,
      upperBound: upperBound <= max ? upperBound : max,
    });
    const [inputRange, setInputRange] = useState(range);

    const [showCalculator, setShowCalculator] = useState(false);

    /** @type {React.ChangeEventHandler<HTMLInputElement>} */
    function handleLowerBoundInputChange({ currentTarget: { value } }) {
      setInputRange((prev) => ({
        ...prev,
        lowerBound: Number.parseFloat(value),
      }));
    }
    /** @type {React.ChangeEventHandler<HTMLInputElement>} */
    function handleUpperBoundInputChange({ currentTarget: { value } }) {
      setInputRange((prev) => ({
        ...prev,
        upperBound: Number.parseFloat(value),
      }));
    }
    function handleInputSubmit() {
      // If the input values are not valid numbers, reset to current range values
      if (
        Number.isNaN(inputRange.lowerBound) ||
        Number.isNaN(inputRange.upperBound)
      ) {
        setInputRange(range);
        return;
      }

      // If count === hideValue, prevent lowerBound from increasing and upperBound from decreasing
      if (
        count === hideValue &&
        (inputRange.lowerBound > range.lowerBound ||
          inputRange.upperBound < range.upperBound)
      ) {
        setInputRange(range);
        return;
      }

      const newRange = { ...inputRange };

      // Clamp newLowerBound to [min, upperBound]
      if (newRange.lowerBound < min) newRange.lowerBound = min;
      if (newRange.lowerBound > range.upperBound)
        newRange.lowerBound = range.upperBound;

      // Clamp newUpperBound to [lowerBound, max]
      if (newRange.upperBound < range.lowerBound)
        newRange.upperBound = range.lowerBound;
      if (newRange.upperBound > max) newRange.upperBound = max;

      // Update the input range.
      setInputRange(newRange);

      // If the range have changed, update the range state and call onAfterDrag.
      if (
        newRange.lowerBound !== range.lowerBound ||
        newRange.upperBound !== range.upperBound
      ) {
        setRange(newRange);
        onAfterDrag(
          newRange.lowerBound,
          newRange.upperBound,
          min,
          max,
          rangeStep,
        );
      }
    }

    // used to update min and max directly using "Assign to min" and "Assign to max" buttons
    function updateBound(value, boundType) {
      let newRange;
      const parsedValue = parseFloat(value);
      if (isNaN(parsedValue)) return;

      if (boundType == 'upper') {
        const newUpper = parsedValue < max ? parsedValue : max;
        newRange = {
          lowerBound: range.lowerBound,
          upperBound: newUpper,
        };
      } else if (boundType == 'lower') {
        const newLower = parsedValue < min ? min : parsedValue;
        newRange = {
          lowerBound: newLower,
          upperBound: range.upperBound,
        };
      }

      setInputRange(newRange);
      setRange(newRange);
      onAfterDrag(
        newRange.lowerBound,
        newRange.upperBound,
        min,
        max,
        rangeStep,
      );
    }

    /** @param {[sliderLowerBound:number, sliderUpperBound: number]} sliderRange */
    function onSliderChange([sliderLowerBound, sliderUpperBound]) {
      const newRange = {
        lowerBound:
          count === hideValue && range.lowerBound < sliderLowerBound
            ? range.lowerBound
            : sliderLowerBound,
        upperBound:
          count === hideValue && range.upperBound > sliderUpperBound
            ? range.upperBound
            : sliderUpperBound,
      };

      setRange(newRange);
      setInputRange(newRange);
    }
    useImperativeHandle(ref, () => ({ onSliderChange }));

    /** @param {[sliderLowerBound:number, sliderUpperBound: number]} sliderRange */
    function onAfterSliderChange([sliderLowerBound, sliderUpperBound]) {
      onAfterDrag(sliderLowerBound, sliderUpperBound, min, max, rangeStep);
    }

    /** @param {number} num */
    function getNumberToFixed(num) {
      return Number.isInteger(num)
        ? num
        : Number.parseFloat(num.toFixed(decimalDigitsLen));
    }

    const params = {
      quantity: 'age',
      desiredUnit: 'days',
      selectUnits: { months: 30, years: 365 },
    };

    return (
      <>
        <div className='g3-range-filter'>
          <p>
            Don’t know the {params.quantity} in {params.desiredUnit}?
          </p>
          <Button
            onClick={() => setShowCalculator(true)}
            label={`Compute ${params.quantity} (in ${params.desiredUnit})`}
            buttonType='default'
          />

          {showCalculator && (
            <UnitCalculator
              setShowCalculator={setShowCalculator}
              parameters={params}
              updateBound={updateBound}
            />
          )}

          {label && <p className='g3-range-filter__title'>{label}</p>}
          <div className='g3-range-filter__bounds'>
            <label htmlFor={`${label}-lower-bound-input`}>
              Min:&nbsp;
              <input
                type='number'
                id={`${label}-lower-bound-input`}
                min={min}
                max={range.upperBound !== undefined ? range.upperBound : max}
                value={inputRange.lowerBound}
                onChange={handleLowerBoundInputChange}
                onKeyPress={(ev) => {
                  if (ev.key === 'Enter') handleInputSubmit();
                }}
                onBlur={handleInputSubmit}
                className='g3-range-filter__bound g3-range-filter__bound--lower'
              />
            </label>
            <label htmlFor={`${label}-upper-bound-input`}>
              Max:&nbsp;
              <input
                type='number'
                id={`${label}-upper-bound-input`}
                min={range.lowerBound !== undefined ? range.lowerBound : min}
                max={max}
                value={inputRange.upperBound}
                onChange={handleUpperBoundInputChange}
                onKeyPress={(ev) => {
                  if (ev.key === 'Enter') handleInputSubmit();
                }}
                onBlur={handleInputSubmit}
                className='g3-range-filter__bound g3-range-filter__bound--lower'
              />
            </label>
          </div>
          <Slider
            range
            className={`g3-range-filter__slider ${
              inactive ? 'g3-range-filter__slider--inactive' : ''
            }`}
            min={getNumberToFixed(min)}
            max={getNumberToFixed(max)}
            value={[
              getNumberToFixed(range.lowerBound),
              getNumberToFixed(range.upperBound),
            ]}
            onChange={onSliderChange}
            onAfterChange={onAfterSliderChange}
            step={rangeStep}
          />
        </div>
      </>
    );
  },
);

RangeFilter.propTypes = {
  count: PropTypes.number,
  decimalDigitsLen: PropTypes.number,
  hideValue: PropTypes.number,
  inactive: PropTypes.bool,
  label: PropTypes.string,
  lowerBound: PropTypes.number,
  max: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  onAfterDrag: PropTypes.func.isRequired,
  upperBound: PropTypes.number,
  rangeStep: PropTypes.number,
};

export default RangeFilter;
