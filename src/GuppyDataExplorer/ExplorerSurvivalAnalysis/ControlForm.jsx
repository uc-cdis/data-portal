import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap_white.css';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Button from '../../gen3-ui-component/components/Button';
import SimpleInputField from '../../components/SimpleInputField';
import { useAppSelector } from '../../redux/hooks';
import { overrideSelectTheme } from '../../utils';
import FilterSetCard from './FilterSetCard';
import {
  checkIfFilterHasDisallowedVariables,
  checkIfFilterInScope,
} from './utils';
import { DEFAULT_END_YEAR, DEFAULT_INTERVAL } from './const';

/** @typedef {import('./types').ExplorerFilterSet} ExplorerFilterSet */
/** @typedef {import('./types').ParsedSurvivalAnalysisResult} ParsedSurvivalAnalysisResult */

/** @typedef {import('./types').UserInputSubmitHandler} UserInputSubmitHandler */

/** @param {{ label: string | JSX.Element; [x: string]: any }} props */
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
            multiValue: (provided, { isDisabled }) => ({
              ...provided,
              backgroundColor: isDisabled
                ? 'lightgrey'
                : provided.backgroundColor,
              paddingRight: isDisabled ? '3px' : provided.paddingRight,
            }),
          }}
        />
      }
    />
  );
}

ControlFormSelect.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
};

/** @param {{ label: string | JSX.Element; [x: string]: any }} props */
function ControlFormInput({ label, ...inputAttrs }) {
  return <SimpleInputField label={label} input={<input {...inputAttrs} />} />;
}

ControlFormInput.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
};

const survivalTypeOptions = [
  { label: 'Overall Survival', value: 'all' },
  { label: 'Event-Free Survival (EFS)', value: 'efs' },
];

/** @type {ExplorerFilterSet['id'][]} */
const emptyFilterSetIds = [];
/** @type {import('../types').SavedExplorerFilterSet} */
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
 */
function ControlForm({ countByFilterSet, onSubmit }) {
  const consortiums = useAppSelector(
    (state) => state.explorer.config.survivalAnalysisConfig.consortium ?? []
  );
  const savedFilterSets = useAppSelector(
    (state) => state.explorer.savedFilterSets.data
  );
  const staleFilterSetIdSet = useAppSelector(
    (state) => new Set(state.explorer.survivalAnalysisResult.staleFilterSetIds)
  );
  const disallowedVariables = useAppSelector(
    (state) =>
      state.explorer.config.survivalAnalysisConfig['excluded_variables'] ?? []
  );

  const [timeInterval, setTimeInterval] = useState(DEFAULT_INTERVAL);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(DEFAULT_END_YEAR);
  const [survivalType, setSurvivalType] = useState(survivalTypeOptions[0]);
  const [selectFilterSet, setSelectFilterSet] = useState(null);
  const [usedFilterSetIds, setUsedFilterSetIds] = useState(emptyFilterSetIds);

  const filterSetOptions = [];
  const usedFilterSets = [];
  for (const filterSet of [defaultFilterSet, ...savedFilterSets]) {
    const { name: label, id: value } = filterSet;
    const isUsed = usedFilterSetIds.includes(value);
    const isOutOfScope = !checkIfFilterInScope(consortiums, filterSet.filter);
    const isDisallowedVariables = checkIfFilterHasDisallowedVariables(
      disallowedVariables,
      filterSet.filter
    );

    const isDisabled = isUsed || isOutOfScope || isDisallowedVariables;

    const disabledOverlay = isUsed
      ? 'This Filter Set is already in use.'
      : isOutOfScope
      ? 'This Filter Set includes out of scope consortia.'
      : isDisallowedVariables
      ? 'This Filter Set includes disallowed variables and cannot be used for survival analysis.'
      : '';

    filterSetOptions.push({
      label: isDisabled ? (
        <Tooltip
          arrowContent={<div className='rc-tooltip-arrow-inner' />}
          mouseLeaveDelay={0}
          overlay={disabledOverlay}
          placement='right'
        >
          <span>{label}</span>
        </Tooltip>
      ) : (
        label
      ),
      value,
      isDisabled,
    });

    if (isUsed) {
      const isStale = staleFilterSetIdSet.has(value);
      usedFilterSets.push({ ...filterSet, isStale });
    }
  }

  const [isInputChanged, setIsInputChanged] = useState(false);
  useEffect(() => {
    if (countByFilterSet === undefined) setIsInputChanged(true);
  }, [countByFilterSet]);

  const submitUserInput = () => {
    setIsInputChanged(false);
    onSubmit({
      timeInterval,
      startTime,
      endTime: endTime || undefined,
      efsFlag: survivalType.value === 'efs',
      usedFilterSets,
    });
  };

  const resetUserInput = () => {
    setTimeInterval(DEFAULT_INTERVAL);
    setStartTime(0);
    setEndTime(DEFAULT_END_YEAR);
    setSurvivalType(survivalTypeOptions[0]);
    setUsedFilterSetIds([]);
    setIsInputChanged(false);
  };

  return (
    <form className='explorer-survival-analysis__control-form'>
      <ControlFormSelect
        inputId='allowed-consortium'
        label={
          <Tooltip
            arrowContent={<div className='rc-tooltip-arrow-inner' />}
            mouseLeaveDelay={0}
            overlay='Survival curves can only be generated for Filter Sets that include patients from allowed consortia.'
            placement='left'
          >
            <span>
              <FontAwesomeIcon
                icon='circle-info'
                color='var(--pcdc-color__primary-light)'
              />{' '}
              Allowed Consortia
            </span>
          </Tooltip>
        }
        components={{
          IndicatorsContainer: () => null,
          MultiValueRemove: () => null,
        }}
        isMulti
        isDisabled
        value={consortiums.map((label) => ({ label }))}
        theme={overrideSelectTheme}
      />
      <ControlFormSelect
        inputId='disallowed-variables'
        label={
          <Tooltip
            arrowContent={<div className='rc-tooltip-arrow-inner' />}
            mouseLeaveDelay={0}
            overlay='Filter sets that use disallowed variables cannot be utilized for survival analysis'
            placement='left'
          >
            <span>
              <FontAwesomeIcon
                icon='circle-info'
                color='var(--pcdc-color__primary-light)'
              />{' '}
              Disallowed Variables
            </span>
          </Tooltip>
        }
        components={{
          IndicatorsContainer: () => null,
          MultiValueRemove: () => null,
        }}
        isMulti
        isDisabled
        value={disallowedVariables}
        theme={overrideSelectTheme}
      />
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
        label={
          <Tooltip
            arrowContent={<div className='rc-tooltip-arrow-inner' />}
            mouseLeaveDelay={0}
            overlay='Clearing this field will show data for all years available.'
            placement='left'
          >
            <span>
              <FontAwesomeIcon
                icon='circle-info'
                color='var(--pcdc-color__primary-light)'
              />{' '}
              End time (year)
            </span>
          </Tooltip>
        }
        type='number'
        placeholder='Optional; max value if left blank'
        min={startTime + 1}
        max={99}
        step={1}
        onBlur={(e) => validateNumberInput(e, setEndTime)}
        onChange={(e) => {
          const numberValue = Number.parseInt(e.target.value, 10);
          setEndTime(isNaN(numberValue) ? '' : numberValue);
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
        onBlur={(e) => validateNumberInput(e, setTimeInterval)}
        onChange={(e) => {
          setTimeInterval(Number.parseInt(e.target.value, 10));
          setIsInputChanged(true);
        }}
        value={timeInterval}
      />
      <div className='explorer-survival-analysis__filter-set-select'>
        <Select
          inputId='survival-filter-sets'
          placeholder='Select Filter Set to analyze'
          options={filterSetOptions}
          onChange={setSelectFilterSet}
          maxMenuHeight={160}
          value={selectFilterSet}
          theme={overrideSelectTheme}
        />
        <Button
          label='Add'
          buttonType='default'
          enabled={selectFilterSet !== null}
          onClick={() => {
            setUsedFilterSetIds((ids) => [...ids, selectFilterSet.value]);
            setSelectFilterSet(null);
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
              setUsedFilterSetIds((ids) =>
                ids.filter((id) => id !== filterSet.id)
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
          enabled={
            usedFilterSets.length > 0 &&
            (isInputChanged || staleFilterSetIdSet.size > 0)
          }
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
};

export default ControlForm;
