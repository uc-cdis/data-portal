import React from 'react';
import PropTypes from 'prop-types';
import { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import './RangeFilter.css';

class RangeFilter extends React.Component {
  constructor(props) {
    super(props);
    // Set lower/upper bounds to min/max if they are undefined or outside the range of [min, max]
    const lowerBound = (props.lowerBound && props.lowerBound >= props.min)
      ? props.lowerBound
      : props.min;
    const upperBound = (props.upperBound && props.upperBound <= props.max)
      ? props.upperBound
      : props.max;
    this.state = {
      lowerBound,
      upperBound,
      lowerBoundInputValue: lowerBound,
      upperBoundInputValue: upperBound,
    };
  }

  onSliderChange(range) {
    this.setState((prevState) => {
      const lowerBound = (this.props.count === this.props.hideValue
        && prevState.lowerBound < range[0])
        ? prevState.lowerBound
        : range[0];
      const upperBound = (this.props.count === this.props.hideValue
        && prevState.upperBound > range[1])
        ? prevState.upperBound
        : range[1];
      return {
        sliderChanged: true,
        lowerBound,
        upperBound,
        lowerBoundInputValue: lowerBound,
        upperBoundInputValue: upperBound,
      };
    },
    () => {
      if (this.props.onDrag) {
        this.props.onDrag(this.state.lowerBound, this.state.upperBound);
      }
    },
    );
  }

  onAfterSliderChange() {
    if (this.state.sliderChanged && this.props.onAfterDrag) {
      this.props.onAfterDrag(
        this.state.lowerBound,
        this.state.upperBound,
        this.props.min,
        this.props.max,
        this.props.rangeStep,
      );
    }
  }

  getNumberToFixed(num) {
    return Number.isInteger(num) ? num
      : Number.parseFloat((Number.parseFloat(num).toFixed(this.props.decimalDigitsLen)));
  }

  handleLowerBoundInputChange(value) {
    this.setState({
      lowerBoundInputValue: value,
    });
  }

  handleUpperBoundInputChange(value) {
    this.setState({
      upperBoundInputValue: value,
    });
  }

  handleInputSubmit() {
    // Convert the input values to a float
    let newLowerBound = Number.parseFloat(this.state.lowerBoundInputValue);
    let newUpperBound = Number.parseFloat(this.state.upperBoundInputValue);
    if (Number.isNaN(newLowerBound) || Number.isNaN(newUpperBound)) {
      // If the conversion to float fails, set lowerBoundInputValue to current lowerBound.
      this.setState(prevState => ({
        lowerBoundInputValue: prevState.lowerBound,
        upperBoundInputValue: prevState.upperBound,
      }));
      return;
    }

    // If count === hideValue, prevent lowerBound from increasing and upperBound from decreasing
    const tieredAccessLockEnabled = this.props.count === this.props.hideValue;
    if (tieredAccessLockEnabled) {
      if (newLowerBound > this.state.lowerBound || newUpperBound < this.state.upperBound) {
        this.setState(prevState => ({
          lowerBoundInputValue: prevState.lowerBound,
          upperBoundInputValue: prevState.upperBound,
        }));
        return;
      }
    }

    // Clamp newLowerBound to [min, upperBound]
    if (newLowerBound < this.props.min) {
      newLowerBound = this.props.min;
    }
    if (newLowerBound > this.state.upperBound) {
      newLowerBound = this.state.upperBound;
    }

    // Clamp newUpperBound to [lowerBound, max]
    if (newUpperBound < this.state.lowerBound) {
      newUpperBound = this.state.lowerBound;
    }
    if (newUpperBound > this.props.max) {
      newUpperBound = this.props.max;
    }


    // If the bounds have changed, set upperBound/lowerBound state and call onAfterDrag.
    if (newLowerBound !== this.state.lowerBound || newUpperBound !== this.state.upperBound) {
      this.setState({
        lowerBound: newLowerBound,
        upperBound: newUpperBound,
        lowerBoundInputValue: newLowerBound,
        upperBoundInputValue: newUpperBound,
      }, () => {
        this.props.onAfterDrag(
          newLowerBound,
          newUpperBound,
          this.props.min,
          this.props.max,
          this.props.rangeStep,
        );
      });
    } else {
      // Otherwise, reset the input values.
      this.setState(prevState => ({
        lowerBoundInputValue: prevState.lowerBound,
        upperBoundInputValue: prevState.upperBound,
      }));
    }
  }

  render() {
    return (
      <div className='g3-range-filter'>
        { this.props.label
          && <p className='g3-range-filter__title'>{this.props.label}</p>
        }
        <div className='g3-range-filter__bounds'>
          <label
            htmlFor={`${this.props.label}-lower-bound-input`}
          >
            Min:&nbsp;
            <input
              type='number'
              id={`${this.props.label}-lower-bound-input`}
              min={this.props.min}
              max={this.state.upperBound !== undefined ? this.state.upperBound : this.props.max}
              value={this.state.lowerBoundInputValue}
              onChange={ev => this.handleLowerBoundInputChange(ev.currentTarget.value)}
              onKeyPress={(ev) => {
                if (ev.key === 'Enter') {
                  this.handleInputSubmit();
                }
              }}
              onBlur={() => this.handleInputSubmit()}
              className='g3-range-filter__bound g3-range-filter__bound--lower'
            />
          </label>
          <label
            htmlFor={`${this.props.label}-upper-bound-input`}
          >
            Max:&nbsp;
            <input
              type='number'
              id={`${this.props.label}-upper-bound-input`}
              min={this.state.lowerBound !== undefined ? this.state.lowerBound : this.props.min}
              max={this.props.max}
              value={this.state.upperBoundInputValue}
              onChange={ev => this.handleUpperBoundInputChange(ev.currentTarget.value)}
              onKeyPress={(ev) => {
                if (ev.key === 'Enter') {
                  this.handleInputSubmit();
                }
              }}
              onBlur={() => this.handleInputSubmit()}
              className='g3-range-filter__bound g3-range-filter__bound--lower'
            />
          </label>
        </div>
        <Range
          className={`g3-range-filter__slider ${this.props.inactive ? 'g3-range-filter__slider--inactive' : ''}`}
          min={this.getNumberToFixed(this.props.min)}
          max={this.getNumberToFixed(this.props.max)}
          value={[
            this.getNumberToFixed(this.state.lowerBound),
            this.getNumberToFixed(this.state.upperBound),
          ]}
          onChange={e => this.onSliderChange(e)}
          onAfterChange={() => this.onAfterSliderChange()}
          step={this.props.rangeStep}
        />
      </div>
    );
  }
}

RangeFilter.propTypes = {
  label: PropTypes.string,
  onDrag: PropTypes.func,
  onAfterDrag: PropTypes.func.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  lowerBound: PropTypes.number,
  upperBound: PropTypes.number,
  decimalDigitsLen: PropTypes.number,
  rangeStep: PropTypes.number,
  hideValue: PropTypes.number,
  count: PropTypes.number,
  inactive: PropTypes.bool,
};

RangeFilter.defaultProps = {
  label: '',
  lowerBound: undefined,
  upperBound: undefined,
  onDrag: () => {},
  decimalDigitsLen: 2,
  rangeStep: 1,
  hideValue: -1,
  count: 0,
  inactive: false,
};

export default RangeFilter;
