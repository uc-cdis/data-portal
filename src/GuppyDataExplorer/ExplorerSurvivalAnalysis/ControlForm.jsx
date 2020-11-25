import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import Button from '@gen3/ui-component/dist/components/Button';
import SimpleInputField from '../../components/SimpleInputField';
import './typedef';

const ControlFormSelect = ({ label, ...selectProps }) => (
  <SimpleInputField
    label={label}
    input={<Select clearable={false} {...selectProps} />}
  />
);

const ControlFormInput = ({ label, ...inputAttrs }) => (
  <SimpleInputField label={label} input={<input {...inputAttrs} />} />
);

const emptySelectOption = { label: 'Select...', value: '' };
const survivalTypeOptions = [
  { label: 'Overall Survival', value: 'all' },
  { label: 'Event-Free Survival (EFS)', value: 'efs' },
];

/**
 * @param {Object} prop
 * @param {FactorItem[]} prop.factors
 * @param {UserInputSubmitHandler} prop.onSubmit
 * @param {number} prop.timeInterval
 * @param {boolean} prop.isError
 * @param {boolean} prop.isFilterChanged
 * @param {Function} prop.setIsFilterChanged
 */
const ControlForm = ({
  factors,
  onSubmit,
  timeInterval,
  isError,
  isFilterChanged,
  setIsFilterChanged,
}) => {
  const [factorVariable, setFactorVariable] = useState(emptySelectOption);
  const [stratificationVariable, setStratificationVariable] = useState(
    emptySelectOption
  );
  const [localTimeInterval, setLocalTimeInterval] = useState(timeInterval);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(20);
  const [survivalType, setSurvivalType] = useState(survivalTypeOptions[0]);

  const [isInputChanged, setIsInputChanged] = useState(false);
  useEffect(() => {
    setIsInputChanged(true);
  }, [
    factorVariable.value,
    stratificationVariable.value,
    localTimeInterval,
    startTime,
    endTime,
    survivalType,
  ]);
  useEffect(() => {
    if (!isInputChanged && isError) setIsInputChanged(true);
  }, [isInputChanged, isError]);

  const [shouldUpdateResults, setShouldUpdateResults] = useState(true);
  useEffect(() => {
    if (isFilterChanged) setShouldUpdateResults(true);
  }, [isFilterChanged]);

  const validateNumberInput = (
    /** @type {{ target: { value: string, min: string, max: string }}} */ e
  ) => {
    const value = Number.parseInt(e.target.value);
    const min = Number.parseInt(e.target.min);
    const max = Number.parseInt(e.target.max);
    if (min && min > value) setLocalTimeInterval(min);
    else if (max && max < value) setLocalTimeInterval(max);
  };

  const withEmptyOption = (
    /** @type {{ label: string, value: string }[]} */ options
  ) => [emptySelectOption, ...options];

  const submitUserInput = () => {
    onSubmit({
      factorVariable: factorVariable.value,
      stratificationVariable: stratificationVariable.value,
      timeInterval: localTimeInterval,
      startTime,
      endTime,
      efsFlag: survivalType.value === 'efs',
      shouldUpdateResults,
    });
    setIsInputChanged(false);
    setIsFilterChanged(false);
    setShouldUpdateResults(false);
  };
  useEffect(() => {
    submitUserInput();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const resetUserInput = () => {
    if (factorVariable.value !== '' || stratificationVariable.value !== '')
      setShouldUpdateResults(true);

    setFactorVariable(emptySelectOption);
    setStratificationVariable(emptySelectOption);
    setLocalTimeInterval(2);
    setStartTime(0);
    setEndTime(20);
    setSurvivalType(survivalTypeOptions[0]);
  };

  return (
    <form className='explorer-survival-analysis__control-form'>
      <ControlFormSelect
        label='Factor variable'
        options={withEmptyOption(factors)}
        onChange={(e) => {
          if (e.value === '' || e.value === stratificationVariable)
            setStratificationVariable(emptySelectOption);

          setFactorVariable(e);
          setShouldUpdateResults(true);
        }}
        value={factorVariable}
      />
      <ControlFormSelect
        label='Stratification variable'
        options={withEmptyOption(
          factors.filter(({ value }) => value !== factorVariable.value)
        )}
        isDisabled={factorVariable.value === ''}
        onChange={(e) => {
          setStratificationVariable(e);
          setShouldUpdateResults(true);
        }}
        value={stratificationVariable}
      />
      <ControlFormInput
        label='Time interval'
        type='number'
        min={1}
        max={5}
        step={1}
        onBlur={validateNumberInput}
        onChange={(e) => setLocalTimeInterval(Number.parseInt(e.target.value))}
        value={localTimeInterval}
      />
      <ControlFormInput
        disabled
        label='Start time (year)'
        type='number'
        min={0}
        max={endTime - 1}
        step={1}
        onBlur={validateNumberInput}
        onChange={(e) => setStartTime(Number.parseInt(e.target.value))}
        value={startTime}
      />
      <ControlFormInput
        label='End time (year)'
        type='number'
        min={startTime + 1}
        max={99}
        step={1}
        onBlur={validateNumberInput}
        onChange={(e) => setEndTime(Number.parseInt(e.target.value))}
        value={endTime}
      />
      <ControlFormSelect
        isDisabled
        label='Survival type'
        options={[
          { label: 'Overall Survival', value: 'all' },
          { label: 'Event-Free Survival (EFS)', value: 'efs' },
        ]}
        onChange={(e) => {
          setSurvivalType(e);
          setShouldUpdateResults(true);
        }}
        value={survivalType}
      />
      <div className='explorer-survival-analysis__button-group'>
        <Button label='Reset' buttonType='default' onClick={resetUserInput} />
        <Button
          label='Apply'
          buttonType='primary'
          onClick={submitUserInput}
          enabled={isInputChanged || isFilterChanged}
        />
      </div>
    </form>
  );
};

ControlForm.propTypes = {
  factors: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    })
  ).isRequired,
  onSubmit: PropTypes.func.isRequired,
  timeInterval: PropTypes.number.isRequired,
};

export default ControlForm;
