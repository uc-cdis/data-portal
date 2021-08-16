import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap_white.css';
import { Radio } from 'antd';
import 'antd/lib/radio/style/index.css';
import { AsyncPaginate } from 'react-select-async-paginate';
import SingleSelectFilter from '../SingleSelectFilter';
import Chip from '../Chip';
import RangeFilter from '../RangeFilter';
import './FilterSection.css';
import '../typedef';

/** @param {OptionFilterStatus | RangeFilterStatus} filterStatus */
function getNumValuesSelected(filterStatus) {
  if (Array.isArray(filterStatus)) return 1;

  let numSelected = 0;
  for (const status of Object.values(filterStatus))
    if (status === true || Array.isArray(status)) numSelected += 1;

  return numSelected;
}

/**
 * @typedef {Object} FilterSectionProps
 * @property {string} disabledTooltipMessage
 * @property {boolean} expanded
 * @property {OptionFilterStatus | RangeFilterStatus} filterStatus
 * @property {boolean} hideZero
 * @property {number} initVisibleItemNumber
 * @property {boolean} isArrayField
 * @property {boolean} isSearchFilter
 * @property {string} lockedTooltipMessage
 * @property {(lowerBound: number, upperBound: number, min: number, max: number, rangeStep: number) => void} onAfterDrag
 * @property {() => void} onClear
 * @property {(searchString: string, offset: number) => void} onSearchFilterLoadOptions
 * @property {(label: string) => void} onSelect
 * @property {(isExpanded: boolean) => void} onToggle
 * @property {(fieldName: string, value: string) => void} onToggleCombineMode
 * @property {(SingleSelectFilterOption[] | RangeFilterOption[])} options
 * @property {number} tierAccessLimit
 * @property {string} title
 * @property {string} tooltip
 */

/**
 * @typedef {Object} FilterSectionState
 * @property {'AND' | 'OR'} combineMode
 * @property {OptionFilterStatus | RangeFilterStatus} filterStatus
 * @property {boolean} isExpanded
 * @property {boolean} isSearchInputEmpty
 * @property {boolean} isShowingCombineMode
 * @property {boolean} isShowingMoreOptions
 * @property {boolean} isShowingSearch
 * @property {{ [label: string]: boolean }} optionsVisibleStatus
 * @property {number} resetClickCounter
 */

/** @param {FilterSectionProps} props */
function FilterSection({
  disabledTooltipMessage = '',
  expanded = true,
  filterStatus: filterStatusProp,
  hideZero = true,
  initVisibleItemNumber = 5,
  isArrayField = false,
  isSearchFilter = false,
  lockedTooltipMessage = '',
  onAfterDrag,
  onClear = () => {},
  onSearchFilterLoadOptions = () => {},
  onSelect,
  onToggle = () => {},
  onToggleCombineMode = () => {},
  options = [],
  tierAccessLimit,
  title = '',
  tooltip,
}) {
  /**
   * @param {boolean} isShowingMoreOptions
   * @param {string} [inputText]
   */
  function getOptionsVisibleStatus(isShowingMoreOptions, inputText) {
    /** @type {{ [label: string]: boolean }} */
    const res = {};
    for (const [i, o] of options.entries())
      res[o.text] =
        inputText === undefined || inputText.trim() === ''
          ? isShowingMoreOptions || i < initVisibleItemNumber
          : o.text.toLowerCase().indexOf(inputText.toLowerCase()) >= 0;

    return res;
  }

  /** @type {[FilterSectionState, React.Dispatch<React.SetStateAction<FilterSectionState>>]} */
  const [state, setState] = useState({
    combineMode: 'OR',
    filterStatus: {},
    isExpanded: expanded,
    isSearchInputEmpty: true,
    isShowingCombineMode: false,
    isShowingMoreOptions: false,
    isShowingSearch: false,
    optionsVisibleStatus: getOptionsVisibleStatus(false),
    // used for rerendering child components when reset button is clicked
    resetClickCounter: 0,
  });
  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      optionsVisibleStatus: getOptionsVisibleStatus(
        prevState.isShowingMoreOptions
      ),
    }));
  }, [options]);

  const inputElem = useRef();

  function clearSearchInput() {
    inputElem.current.value = '';
    setState((prevState) => ({
      ...prevState,
      isSearchInputEmpty: true,
      optionsVisibleStatus: getOptionsVisibleStatus(
        prevState.isShowingMoreOptions
      ),
    }));
  }

  /** @param {'AND' | 'OR'} combineMode */
  function handleSetCombineModeOption(combineMode) {
    setState((prevState) => ({ ...prevState, combineMode }));
    onToggleCombineMode('__combineMode', combineMode);
  }

  /** @param {React.DOMAttributes<HTMLDivElement>.onClick} ev */
  function handleClearButtonClick(ev) {
    ev.stopPropagation();
    setState((prevState) => ({
      ...prevState,
      filterStatus: {},
      resetClickCounter: prevState.resetClickCounter + 1,
    }));
    onClear();
  }

  function handleSearchInputChange() {
    const currentInput = inputElem.current.value;
    setState((prevState) => ({
      ...prevState,
      isSearchInputEmpty: !currentInput || currentInput.length === 0,
      optionsVisibleStatus: getOptionsVisibleStatus(
        prevState.isShowingMoreOptions
      ),
    }));
  }

  /** @param {string} label */
  function handleSelectSingleSelectFilter(label) {
    setState((prevState) => {
      const newFilterStatus = { ...prevState.filterStatus };
      const isSelected = newFilterStatus[label];
      newFilterStatus[label] = isSelected === undefined || !isSelected;
      return {
        ...prevState,
        filterStatus: newFilterStatus,
      };
    });
    onSelect(label);
  }

  /**
   * @param {number} lowerBound
   * @param {number} upperBound
   * @param {number} min
   * @param {number} max
   * @param {number} rangeStep
   */
  function handleDragRangeFilter(lowerBound, upperBound, ...args) {
    setState((prevState) => ({
      ...prevState,
      filterStatus: [lowerBound, upperBound],
    }));
    onAfterDrag(lowerBound, upperBound, ...args);
  }

  /** @param {boolean} [open] */
  function toggleIsExpanded(open) {
    const newIsExpanded = open ?? !state.isExpanded;
    onToggle(newIsExpanded);
    setState((prevState) => ({ ...prevState, isExpanded: newIsExpanded }));
  }
  useEffect(() => {
    toggleIsExpanded(expanded);
  }, [expanded]);

  function toggleIsShowingCombineMode() {
    setState((prevState) => ({
      ...prevState,
      isShowingCombineMode: !prevState.isShowingCombineMode,
      isShowingSearch: false,
    }));
  }

  function toggleIsShowingMoreOptions() {
    setState((prevState) => ({
      ...prevState,
      isShowingMoreOptions: !prevState.isShowingMoreOptions,
      optionsVisibleStatus: getOptionsVisibleStatus(
        !prevState.isShowingMoreOptions
      ),
    }));
  }

  function toggleIsShowingSearch() {
    setState((prevState) => ({
      ...prevState,
      isShowingCombineMode: false,
      isShowingSearch: !prevState.isShowingSearch,
    }));
  }

  function renderCombineOptionButton() {
    const tooltipText =
      'This toggle selects the logical operator used to combine checked filter options. ' +
      'If AND is set, records must match all checked filter options. ' +
      'If OR is set, records must match at least one checked option.';
    return (
      <div
        className={
          state.isExpanded && state.isShowingCombineMode
            ? 'g3-filter-section__and-or-toggle'
            : 'g3-filter-section__hidden'
        }
      >
        <span style={{ marginRight: '5px' }}>Combine with </span>
        <Radio.Group
          buttonStyle='solid'
          defaultValue={state.combineMode}
          onChange={handleSetCombineModeOption}
          options={[
            { label: 'AND', value: 'AND' },
            { label: 'OR', value: 'OR' },
          ]}
          optionType='button'
        />
        <Tooltip
          arrowContent={<div className='rc-tooltip-arrow-inner' />}
          overlay={tooltipText}
          overlayClassName='g3-filter-section__and-or-toggle-helper-tooltip'
          placement='right'
          trigger={['hover', 'focus']}
          width='300px'
        >
          <span className='g3-helper-tooltip'>
            <i className='g3-icon g3-icon--sm g3-icon--question-mark-bootstrap help-tooltip-icon' />
          </span>
        </Tooltip>
      </div>
    );
  }

  function renderSearchFilter() {
    const selectedOptions = [];
    for (const [value, isSelected] of Object.entries(state.filterStatus))
      if (isSelected) selectedOptions.push({ value, label: value });

    return (
      <AsyncPaginate
        cacheOptions
        className={
          state.isExpanded ? '' : 'g3-filter-section__search-filter--hidden'
        }
        controlShouldRenderValue={false}
        debounceTimeout={250}
        defaultOptions
        onChange={(option) => handleSelectSingleSelectFilter(option.value)}
        loadOptions={(input, loadedOptions) =>
          onSearchFilterLoadOptions(input, loadedOptions.length)
        }
        value={selectedOptions}
      />
    );
  }

  function renderSearchInput() {
    return (
      <div
        className={
          state.isExpanded && state.isShowingSearch
            ? 'g3-filter-section__search-input'
            : 'g3-filter-section__hidden'
        }
      >
        <input
          className='g3-filter-section__search-input-box body'
          onChange={handleSearchInputChange}
          ref={inputElem}
        />
        <span
          aria-label={state.isSearchInputEmpty ? 'Search' : 'Clear'}
          className=''
          onClick={state.isSearchInputEmpty ? undefined : clearSearchInput}
          onKeyPress={(e) => {
            if (state.isSearchInputEmpty) return;

            if (e.charCode === 13 || e.charCode === 32) {
              e.preventDefault();
              clearSearchInput();
            }
          }}
          role='button'
          tabIndex={0}
        >
          <i
            className={`g3-icon g3-icon--${
              state.isSearchInputEmpty ? 'search' : 'cross'
            } g3-filter-section__search-input-close`}
          />
        </span>
      </div>
    );
  }

  function renderShowMoreButton() {
    let totalCount = 0;
    for (const o of options)
      if (o.count > 0 || !hideZero || o.count === -1) totalCount += 1;

    return (
      totalCount > initVisibleItemNumber && (
        <div
          aria-label={state.isShowingMoreOptions ? 'Show less' : 'Show more'}
          className='g3-filter-section__show-more'
          onClick={toggleIsShowingMoreOptions}
          onKeyPress={(e) => {
            if (e.charCode === 13 || e.charCode === 32) {
              e.preventDefault();
              toggleIsShowingMoreOptions();
            }
          }}
          role='button'
          tabIndex={0}
        >
          {state.isShowingMoreOptions
            ? 'less'
            : `${(totalCount - initVisibleItemNumber).toLocaleString()} more`}
        </div>
      )
    );
  }

  /** @param {RangeFilterStatus} filterStatus */
  function renderRangeFilter(filterStatus) {
    return options.map(
      /** @param {RangeFilterOption} option */
      (option) => {
        if (!state.optionsVisibleStatus[option.text]) {
          return null;
        }
        const lowerBound =
          filterStatus === undefined || filterStatus.length !== 2
            ? undefined
            : filterStatus[0];
        const upperBound =
          filterStatus === undefined || filterStatus.length !== 2
            ? undefined
            : filterStatus[1];
        return (
          // We use the 'key' prop to force the SingleSelectFilter
          // to rerender if the `reset` button is clicked.
          // Each reset button click increments the counter and changes the key.
          // See https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key
          <RangeFilter
            key={`${option.text}-${option.min}-${option.max}-${lowerBound}-${upperBound}-${state.resetClickCounter}`}
            count={option.count}
            // NOTE: Guppy returns a count of -1 when the count is hidden from the end user.
            hideValue={-1}
            inactive={lowerBound === undefined && upperBound === undefined}
            label={option.text}
            max={option.max}
            min={option.min}
            lowerBound={lowerBound}
            upperBound={upperBound}
            onAfterDrag={handleDragRangeFilter}
          />
        );
      }
    );
  }

  /** @param {OptionFilterStatus} filterStatus */
  function renderTextFilter(filterStatus) {
    return options.map(
      /** @param {SingleSelectFilterOption} option */
      (option) => {
        if (
          // For searchFilters, options are treated differently -- the only
          // options passed are the already selected options, as opposed
          // to all available options in textfilters. So don't filter out
          // any options based on `optionsVisibleStatus`.
          !isSearchFilter &&
          !state.optionsVisibleStatus[option.text]
        ) {
          return null;
        }
        return (
          // We use the 'key' prop to force the SingleSelectFilter
          // to rerender on filterStatus change.
          // See https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key
          <SingleSelectFilter
            key={`${option.text}-${
              filterStatus[option.text] ? 'enabled' : 'disabled'
            }`}
            accessible={option.accessible}
            count={isSearchFilter ? null : option.count}
            disabled={option.disabled}
            disabledTooltipMessage={disabledTooltipMessage}
            hideZero={hideZero}
            label={option.text}
            lockedTooltipMessage={lockedTooltipMessage}
            onSelect={handleSelectSingleSelectFilter}
            selected={filterStatus[option.text]}
            tierAccessLimit={tierAccessLimit}
          />
        );
      }
    );
  }

  // Takes in parent component's filterStatus or self state's filterStatus
  const filterStatus = filterStatusProp ?? state.filterStatus;
  const isTextFilter =
    !isSearchFilter && options[0]?.filterType === 'singleSelect';
  const isRangeFilter = !isSearchFilter && !isTextFilter;

  const numSelected = getNumValuesSelected(filterStatus);
  const sectionHeader = (
    <div className='g3-filter-section__header'>
      <div
        aria-label={`${
          state.isExpanded ? 'Collapse' : 'Expand'
        } filter: ${title}`}
        className='g3-filter-section__title-container'
        onClick={() => toggleIsExpanded()}
        onKeyPress={(e) => {
          if (e.charCode === 13 || e.charCode === 32) {
            e.preventDefault();
            toggleIsExpanded();
          }
        }}
        role='button'
        tabIndex={0}
      >
        <div className='g3-filter-section__toggle-icon-container'>
          <i
            className={`g3-filter-section__toggle-icon g3-icon g3-icon-color__coal 
                g3-icon--sm g3-icon--chevron-${
                  state.isExpanded ? 'down' : 'right'
                }`}
          />
        </div>
        <div
          className={`g3-filter-section__title ${
            numSelected !== 0 ? 'g3-filter-section__title--active' : ''
          }`}
        >
          {title}
        </div>
        {isRangeFilter && numSelected !== 0 && (
          <div className='g3-filter-section__selected-count-chip'>
            <div
              aria-label='Reset filter'
              className='g3-filter-section__range-filter-clear-btn'
              onClick={handleClearButtonClick}
              onKeyPress={(e) => {
                if (e.keyCode === 13 || e.keyCode === 32) {
                  e.preventDefault();
                  handleClearButtonClick(e);
                }
              }}
              role='button'
              tabIndex={0}
            >
              <div className='g3-filter-section__range-filter-clear-btn-text'>
                reset
              </div>
              <div className='g3-filter-section__range-filter-clear-btn-icon'>
                <i className='g3-icon g3-icon--sm g3-icon-color__lightgray g3-icon--sm g3-icon--undo' />
              </div>
            </div>
          </div>
        )}
        {(isTextFilter || isSearchFilter) && numSelected !== 0 && (
          <div className='g3-filter-section__selected-count-chip'>
            <Chip
              text={
                <>
                  <span className='g3-filter-section__selected-count-chip-text-emphasis'>
                    {numSelected}
                  </span>
                  &nbsp;selected
                </>
              }
              onClearButtonClick={handleClearButtonClick}
            />
          </div>
        )}
      </div>
      {isTextFilter && isArrayField && (
        <div
          aria-label={
            state.isShowingCombineMode
              ? 'Hide filter combine mode'
              : 'Show filter combine mode'
          }
          onClick={toggleIsShowingCombineMode}
          onKeyPress={(e) => {
            if (e.charCode === 13 || e.charCode === 32) {
              e.preventDefault();
              toggleIsShowingCombineMode();
            }
          }}
          role='button'
          tabIndex={0}
        >
          <i className='g3-filter-section__toggle-icon g3-icon g3-icon--sm g3-icon--gear' />
        </div>
      )}
      {isTextFilter && (
        <div
          aria-label={state.isShowingSearch ? 'Hide search' : 'Show search'}
          onClick={toggleIsShowingSearch}
          onKeyPress={(e) => {
            if (e.charCode === 13 || e.charCode === 32) {
              e.preventDefault();
              toggleIsShowingSearch();
            }
          }}
          role='button'
          tabIndex={0}
        >
          <i className='g3-filter-section__search-icon g3-icon g3-icon--sm g3-icon--search' />
        </div>
      )}
    </div>
  );

  return (
    <div className='g3-filter-section'>
      {tooltip ? (
        <Tooltip
          arrowContent={<div className='rc-tooltip-arrow-inner' />}
          overlay={<span>{tooltip}</span>}
          overlayClassName='g3-filter-section__tooltip'
          placement='topLeft'
        >
          {sectionHeader}
        </Tooltip>
      ) : (
        sectionHeader
      )}
      {isTextFilter && renderSearchInput()}
      {isArrayField && renderCombineOptionButton()}
      {isSearchFilter && renderSearchFilter()}
      {state.isExpanded && (
        <div className='g3-filter-section__options'>
          {(isTextFilter || isSearchFilter) && renderTextFilter(filterStatus)}
          {isRangeFilter && renderRangeFilter(filterStatus)}
          {isTextFilter && state.isSearchInputEmpty && renderShowMoreButton()}
        </div>
      )}
    </div>
  );
}

FilterSection.propTypes = {
  expanded: PropTypes.bool,
  filterStatus: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.number),
  ]),
  hideZero: PropTypes.bool,
  initVisibleItemNumber: PropTypes.number,
  isArrayField: PropTypes.bool,
  isSearchFilter: PropTypes.bool,
  onAfterDrag: PropTypes.func.isRequired,
  onClear: PropTypes.func,
  onSearchFilterLoadOptions: PropTypes.func,
  onSelect: PropTypes.func.isRequired,
  onToggle: PropTypes.func,
  onToggleCombineMode: PropTypes.func,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      filterType: PropTypes.oneOf(['singleSelect', 'range']).isRequired,
      text: PropTypes.string,
      count: PropTypes.number, // both filters need this for access control

      // for single select filter
      accessible: PropTypes.bool,
      disabled: PropTypes.bool,

      // for range filter
      min: PropTypes.number,
      max: PropTypes.number,
      rangeStep: PropTypes.number, // by default 1
    })
  ),
  tierAccessLimit: PropTypes.number,
  title: PropTypes.string,
  tooltip: PropTypes.string,
  lockedTooltipMessage: PropTypes.string,
  disabledTooltipMessage: PropTypes.string,
};

export default FilterSection;
