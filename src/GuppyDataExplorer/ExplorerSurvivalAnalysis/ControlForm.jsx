import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import Button from '@gen3/ui-component/dist/components/Button';
import './typedef';

/**
 * @param {Object} prop
 * @param {string} prop.label
 * @param {JSX.Element} prop.input
 */
const ControlFormField = ({ label, input }) => (
  <div className='explorer-survival-analysis__field-container'>
    <label className='explorer-survival-analysis__field-label'>{label}</label>
    <div className='explorer-survival-analysis__field-input'>{input}</div>
  </div>
);

const ControlFormSelect = ({ label, ...selectProps }) => (
  <ControlFormField
    label={label}
    input={<Select clearable={false} {...selectProps} />}
  />
);

const ControlFormInput = ({ label, ...inputAttrs }) => (
  <ControlFormField
    label={label}
    input={
      <input
        className='explorer-survival-analysis__field_input__input'
        {...inputAttrs}
      />
    }
  />
);

/**
 * @param {Object} prop
 * @param {FactorItem[]} prop.factors
 * @param {UserInputSubmitHandler} prop.onSubmit
 * @param {number} prop.timeInterval
 */
const ControlForm = ({ factors, onSubmit, timeInterval }) => {
  const [factorVariable, setFactorVariable] = useState('');
  const [stratificationVariable, setStratificationVariable] = useState('');
  const [localTimeInterval, setLocalTimeInterval] = useState(timeInterval);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(20);
  const [survivalType, setSurvivalType] = useState('all');

  const [isInputChanged, setIsInputChanged] = useState(false);
  useEffect(() => {
    setIsInputChanged(true);
  }, [
    factorVariable,
    stratificationVariable,
    localTimeInterval,
    startTime,
    endTime,
    survivalType,
  ]);

  /**
   * @param {{ target: { value: string, min: string, max: string }}} e
   */
  const validateNumberInput = (e) => {
    const value = Number.parseInt(e.target.value);
    const min = Number.parseInt(e.target.min);
    const max = Number.parseInt(e.target.max);
    if (min && min > value) setLocalTimeInterval(min);
    else if (max && max < value) setLocalTimeInterval(max);
  };

  /**
   * @param {{ label: string, value: string }[]} options
   */
  const withEmptyOption = (options) => [
    { label: 'Select...', value: '' },
    ...options,
  ];

  const submitUserInput = () => {
    onSubmit({
      factorVariable,
      stratificationVariable,
      timeInterval: localTimeInterval,
      startTime,
      endTime,
      efsFlag: survivalType === 'efs',
    });
    setIsInputChanged(false);
  };
  useEffect(() => {
    submitUserInput();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const resetUserInput = () => {
    setFactorVariable('');
    setStratificationVariable('');
    setLocalTimeInterval(2);
    setStartTime(0);
    setEndTime(20);
    setSurvivalType('all');
  };

  return (
    <form className='explorer-survival-analysis__control-form'>
      <ControlFormSelect
        label='Factor variable'
        options={withEmptyOption(factors)}
        onChange={({ value }) => {
          if (value === '' || value === stratificationVariable)
            setStratificationVariable('');

          setFactorVariable(value);
        }}
        value={factorVariable}
      />
      <ControlFormSelect
        label='Stratification variable'
        options={withEmptyOption(
          factors.filter(({ value }) => value !== factorVariable)
        )}
        disabled={factorVariable === ''}
        onChange={({ value }) => setStratificationVariable(value)}
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
      <div className='explorer-survival-analysis__warning'>
        WARNING: The inputs below are disabled while using mocked result.
      </div>
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
        disabled
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
        disabled
        label='Survival type'
        options={[
          { label: 'All Survival', value: 'all' },
          { label: 'Event-Free Survival (EFS)', value: 'efs' },
        ]}
        onChange={({ value }) => setSurvivalType(value)}
        value={survivalType}
      />
      <div className='explorer-survival-analysis__button-group'>
        <Button label='Reset' buttonType='default' onClick={resetUserInput} />
        <Button
          label='Apply'
          buttonType='primary'
          onClick={submitUserInput}
          enabled={isInputChanged}
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
