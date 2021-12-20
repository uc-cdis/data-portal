import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import Button from '../../gen3-ui-component/components/Button';
import SimpleInputField from '../../components/SimpleInputField';
import { overrideSelectTheme } from '../../utils';
import { useExplorerFilterSets } from '../ExplorerFilterSetsContext';
import FilterSetCard from './FilterSetCard';
import './typedef';

/** @param {{ label: string; [x: string]: any }} props */
const ControlFormSelect = ({ label, ...selectProps }) => (
  <SimpleInputField
    label={label}
    input={
      <Select
        {...selectProps}
        isClearable={false}
        theme={overrideSelectTheme}
        styles={{
          control: (provided, { isDisabled }) => ({
            ...provided,
            cursor: isDisabled ? 'not-allowed' : '',
            pointerEvents: 'auto',
          }),
        }}
      />
    }
  />
);

ControlFormSelect.propTypes = {
  label: PropTypes.string,
};

/** @param {{ label: string; [x: string]: any }} props */
const ControlFormInput = ({ label, ...inputAttrs }) => (
  <SimpleInputField label={label} input={<input {...inputAttrs} />} />
);

ControlFormInput.propTypes = {
  label: PropTypes.string,
};

const survivalTypeOptions = [
  { label: 'Overall Survival', value: 'all' },
  { label: 'Event-Free Survival (EFS)', value: 'efs' },
];

/** @type {ExplorerFilterSet[]} */
const emptyFilterSets = [];

/** @type {ExplorerFilterSet} */
export const defaultFilterSet = {
  name: '*** All Subjects ***',
  description: '',
  filters: {},
  id: -1,
};

/**
 * @param {Object} prop
 * @param {UserInputSubmitHandler} prop.onSubmit
 * @param {number} prop.timeInterval
 * @param {boolean} prop.isError
 */
const ControlForm = ({ onSubmit, timeInterval, isError }) => {
  const [localTimeInterval, setLocalTimeInterval] = useState(timeInterval);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(undefined);
  const [survivalType, setSurvivalType] = useState(survivalTypeOptions[0]);

  const [selectFilterSetOption, setSelectFilterSetOption] = useState(null);
  const [usedFilterSets, setUsedFilterSets] = useState(emptyFilterSets);
  const { filterSets } = useExplorerFilterSets();
  const filterSetOptions = [defaultFilterSet, ...filterSets].map(
    (filterSet) => ({
      label: filterSet.name,
      value: filterSet,
      isDisabled: usedFilterSets.some(({ id }) => id === filterSet.id),
    })
  );

  const [isInputChanged, setIsInputChanged] = useState(false);
  useEffect(() => {
    if (!isInputChanged && isError) setIsInputChanged(true);
  }, [isInputChanged, isError]);

  const validateNumberInput = (
    /** @type {{ target: { value: string, min: string, max: string }}} */ e
  ) => {
    if (e.target.value !== '') {
      const value = Number.parseInt(e.target.value, 10);
      const min = Number.parseInt(e.target.min, 10);
      const max = Number.parseInt(e.target.max, 10);
      if (min && min > value) setLocalTimeInterval(min);
      else if (max && max < value) setLocalTimeInterval(max);
    }
  };

  const [shouldSubmit, setShouldSubmit] = useState(false);
  useEffect(() => {
    if (shouldSubmit) {
      onSubmit({
        timeInterval: localTimeInterval,
        startTime,
        endTime,
        efsFlag: survivalType.value === 'efs',
        usedFilterSets,
      });
      setShouldSubmit(false);
    }
  }, [shouldSubmit]);

  const submitUserInput = () => {
    setIsInputChanged(false);
    setShouldSubmit(true);
  };

  const resetUserInput = () => {
    setLocalTimeInterval(2);
    setStartTime(0);
    setEndTime(undefined);
    setSurvivalType(survivalTypeOptions[0]);
    setUsedFilterSets(emptyFilterSets);
    setIsInputChanged(false);
    setShouldSubmit(true);
  };

  return (
    <form className='explorer-survival-analysis__control-form'>
      <ControlFormSelect
        inputId='survival-type'
        isDisabled
        label='Survival type'
        options={[
          { label: 'Overall Survival', value: 'all' },
          { label: 'Event-Free Survival (EFS)', value: 'efs' },
        ]}
        onChange={(e) => {
          setSurvivalType(e);
          setIsInputChanged(true);
        }}
        value={survivalType}
      />
      <ControlFormInput
        id='survival-start-time'
        disabled
        label='Start time (year)'
        type='number'
        min={0}
        max={endTime - 1}
        step={1}
        onBlur={validateNumberInput}
        onChange={(e) => {
          setStartTime(Number.parseInt(e.target.value, 10));
          setIsInputChanged(true);
        }}
        value={startTime}
      />
      <ControlFormInput
        id='survival-end-time'
        label='End time (year)'
        type='number'
        min={startTime + 1}
        max={99}
        step={1}
        onBlur={validateNumberInput}
        onChange={(e) => {
          setEndTime(
            e.target.value === ''
              ? undefined
              : Number.parseInt(e.target.value, 10)
          );
          setIsInputChanged(true);
        }}
        value={endTime}
      />
      <ControlFormInput
        id='survival-time-interval'
        label='Time interval'
        type='number'
        min={1}
        max={5}
        step={1}
        onBlur={validateNumberInput}
        onChange={(e) => {
          setLocalTimeInterval(Number.parseInt(e.target.value, 10));
          setIsInputChanged(true);
        }}
        value={localTimeInterval}
      />
      <div className='explorer-survival-analysis__filter-set-select'>
        <Select
          inputId='survival-filter-sets'
          placeholder='Select Filter Set to analyze'
          options={filterSetOptions}
          onChange={setSelectFilterSetOption}
          value={selectFilterSetOption}
          theme={overrideSelectTheme}
        />
        <Button
          label='Add'
          buttonType='default'
          enabled={selectFilterSetOption !== null}
          onClick={() => {
            setUsedFilterSets((prevFilterSets) => [
              ...prevFilterSets,
              selectFilterSetOption.value,
            ]);
            setSelectFilterSetOption(null);
            setIsInputChanged(true);
          }}
        />
      </div>
      {usedFilterSets.length === 0 ? (
        <span style={{ fontStyle: 'italic' }}>
          Nothing to show here. Try select and use Filter Sets for survival
          analysis.
        </span>
      ) : (
        usedFilterSets.map((filterSet, i) => (
          <FilterSetCard
            key={filterSet.id}
            filterSet={filterSet}
            label={`${i + 1}. ${filterSet.name}`}
            onClose={() => {
              setUsedFilterSets((prevFilterSets) =>
                prevFilterSets.filter(({ id }) => id !== filterSet.id)
              );
              setIsInputChanged(true);
            }}
          />
        ))
      )}
      <div className='explorer-survival-analysis__button-group'>
        <Button label='Reset' buttonType='default' onClick={resetUserInput} />
        <Button
          label='Apply'
          buttonType='primary'
          onClick={submitUserInput}
          enabled={isInputChanged && usedFilterSets.length > 0}
        />
      </div>
    </form>
  );
};

ControlForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  timeInterval: PropTypes.number.isRequired,
  isError: PropTypes.bool,
};

export default ControlForm;
