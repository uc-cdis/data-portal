import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import Button from '../../gen3-ui-component/components/Button';
import SimpleInputField from '../../components/SimpleInputField';
import { useAppSelector } from '../../redux/hooks';
import { overrideSelectTheme } from '../../utils';
import FilterSetCard from './FilterSetCard';

/** @typedef {import('./types').ExplorerFilterSet} ExplorerFilterSet */
/** @typedef {import('./types').ParsedSurvivalAnalysisResult} ParsedSurvivalAnalysisResult */
/** @typedef {import('./types').UserInputSubmitHandler} UserInputSubmitHandler */

/** @param {{ label: string; [x: string]: any }} props */
function ControlFormSelect({ label, ...selectProps }) {
  return (
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
}

ControlFormSelect.propTypes = {
  label: PropTypes.string,
};

/** @param {{ label: string; [x: string]: any }} props */
function ControlFormInput({ label, ...inputAttrs }) {
  return <SimpleInputField label={label} input={<input {...inputAttrs} />} />;
}

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
  filter: {},
  id: -1,
};

/**
 * @param {React.FocusEvent<HTMLInputElement>} e
 * @param {React.Dispatch<React.SetStateAction<number>>} setStateAction
 */
function validateNumberInput(e, setStateAction) {
  if (e.target.value !== '') {
    const value = Number.parseInt(e.target.value, 10);
    const min = Number.parseInt(e.target.min, 10);
    const max = Number.parseInt(e.target.max, 10);
    if (min && min > value) setStateAction(min);
    else if (max && max < value) setStateAction(max);
  }
}

/**
 * @param {Object} prop
 * @param {ParsedSurvivalAnalysisResult['count']} [prop.countByFilterSet]
 * @param {UserInputSubmitHandler} prop.onSubmit
 * @param {number} prop.timeInterval
 */
function ControlForm({ countByFilterSet, onSubmit, timeInterval }) {
  const [localTimeInterval, setLocalTimeInterval] = useState(timeInterval);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(undefined);
  const [survivalType, setSurvivalType] = useState(survivalTypeOptions[0]);

  const [selectFilterSetOption, setSelectFilterSetOption] = useState(null);
  const [usedFilterSets, setUsedFilterSets] = useState(emptyFilterSets);
  const savedFilterSets = useAppSelector(
    (state) => state.explorer.savedFilterSets.data
  );
  const filterSetOptions = [defaultFilterSet, ...savedFilterSets].map(
    (filterSet) => ({
      label: filterSet.name,
      value: filterSet,
      isDisabled: usedFilterSets.some(({ id }) => id === filterSet.id),
    })
  );

  const [isInputChanged, setIsInputChanged] = useState(false);
  useEffect(() => {
    if (countByFilterSet === undefined) setIsInputChanged(true);
  }, [countByFilterSet]);

  const submitUserInput = () => {
    setIsInputChanged(false);
    onSubmit({
      timeInterval: localTimeInterval,
      startTime,
      endTime: endTime || undefined,
      efsFlag: survivalType.value === 'efs',
      usedFilterSets,
    });
  };

  const resetUserInput = () => {
    setLocalTimeInterval(4);
    setStartTime(0);
    setEndTime(undefined);
    setSurvivalType(survivalTypeOptions[0]);
    setUsedFilterSets(emptyFilterSets);
    setIsInputChanged(false);
  };

  return (
    <form className='explorer-survival-analysis__control-form'>
      <ControlFormSelect
        inputId='survival-type'
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
        max={Number.isInteger(endTime) ? endTime - 1 : undefined}
        step={1}
        onBlur={(e) => validateNumberInput(e, setStartTime)}
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
        placeholder='Optional; max value if left blank'
        min={startTime + 1}
        max={99}
        step={1}
        onBlur={(e) => validateNumberInput(e, setEndTime)}
        onChange={(e) => {
          setEndTime(Number.parseInt(e.target.value, 10));
          setIsInputChanged(true);
        }}
        value={endTime}
      />
      <ControlFormInput
        id='survival-time-interval'
        label='Time interval (year)'
        type='number'
        min={1}
        max={5}
        step={1}
        onBlur={(e) => validateNumberInput(e, setLocalTimeInterval)}
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
          maxMenuHeight={160}
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
            count={countByFilterSet?.[filterSet.name]}
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
}

ControlForm.propTypes = {
  countByFilterSet: PropTypes.objectOf(
    PropTypes.exact({
      fitted: PropTypes.number,
      total: PropTypes.number,
    })
  ),
  onSubmit: PropTypes.func.isRequired,
  timeInterval: PropTypes.number.isRequired,
};

export default ControlForm;
