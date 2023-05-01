import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Tooltip from 'rc-tooltip';
import ButtonToggle from '../../ButtonToggle';
import 'rc-tooltip/assets/bootstrap_white.css';
import { AsyncPaginate } from 'react-select-async-paginate';
import SingleSelectFilter from '../SingleSelectFilter';
import Chip from '../Chip';
import RangeFilter from '../RangeFilter';
import './FilterSection.css';

/** @typedef {import('react-select-async-paginate').Response<any, null, null>} PaginateResponse */
/** @typedef {import('../types').OptionFilterStatus} OptionFilterStatus */
/** @typedef {import('../types').RangeFilterOption} RangeFilterOption */
/** @typedef {import('../types').RangeFilterStatus} RangeFilterStatus */

/** @typedef {import('../types').SingleSelectFilterOption} SingleSelectFilterOption */

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
 * @property {string} [disabledTooltipMessage]
 * @property {string} [sectionTitle]
 * @property {boolean} [excluded]
 * @property {boolean} [expanded]
 * @property {OptionFilterStatus | RangeFilterStatus} [filterStatus]
 * @property {boolean} [hideZero]
 * @property {number} [initVisibleItemNumber]
 * @property {boolean} [isArrayField]
 * @property {boolean} [isSearchFilter]
 * @property {string} [lockedTooltipMessage]
 * @property {(lowerBound: number, upperBound: number, min: number, max: number, rangeStep: number) => void} onAfterDrag
 * @property {() => void} [onClear]
 * @property {(searchString: string, offset: number) => PaginateResponse} [onSearchFilterLoadOptions]
 * @property {(label: string, isExclusion: boolean) => void} [onSelect]
 * @property {(isExclusion: boolean) => void} [onToggleExclusion]
 * @property {(isExpanded: boolean) => void} [onToggle]
 * @property {(fieldName: string, value: string) => void} [onToggleCombineMode]
 * @property {(SingleSelectFilterOption[] | RangeFilterOption[])} options
 * @property {string} [title]
 * @property {string} [tooltip]
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

const defaultOptions = [];

/** @param {FilterSectionProps} props */
function FilterSection({
  disabledTooltipMessage = '',
  sectionTitle = '',
  excluded = false,
  expanded = true,
  filterStatus: filterStatusProp,
  hideZero = true,
  initVisibleItemNumber = 5,
  isArrayField = false,
  isSearchFilter = false,
  lockedTooltipMessage = '',
  onAfterDrag,
  onClear = () => {},
  onSearchFilterLoadOptions,
  onSelect,
  onToggle = () => {},
  onToggleCombineMode = () => {},
  onToggleExclusion = () => {},
  options = defaultOptions,
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
    isExclusion: excluded,
    isSearchInputEmpty: true,
    isShowingCombineMode: false,
    isShowingMoreOptions: false,
    isShowingSearch: false,
    optionsVisibleStatus: getOptionsVisibleStatus(false),
    // used for rerendering child components when reset button is clicked
    resetClickCounter: 0,
  });

  /** @type {React.MutableRefObject<HTMLInputElement>} */
  const inputElem = useRef();
  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      optionsVisibleStatus: getOptionsVisibleStatus(
        prevState.isShowingMoreOptions,
        inputElem.current?.value
      ),
    }));
  }, [options]);

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

  /** @param {React.ChangeEvent<HTMLInputElement>} e */
  function handleSetCombineModeOption(e) {
    const combineMode = /** @type {FilterSectionState['combineMode']} */ (
      e.target.value
    );
    setState((prevState) => ({ ...prevState, combineMode }));
    onToggleCombineMode('__combineMode', combineMode);
  }

  function handleClearButtonClick() {
    setState((prevState) => ({
      ...prevState,
      filterStatus: {},
      resetClickCounter: prevState.resetClickCounter + 1,
      isExclusion: false,
    }));
    onClear();
  }

  function handleSearchInputChange() {
    const currentInput = inputElem.current.value;
    setState((prevState) => ({
      ...prevState,
      isSearchInputEmpty: !currentInput || currentInput.length === 0,
      optionsVisibleStatus: getOptionsVisibleStatus(
        prevState.isShowingMoreOptions,
        currentInput
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
    onSelect(label, state.isExclusion);
  }

  /**
   * @param {number} lowerBound
   * @param {number} upperBound
   * @param {[min: number, max: number, rangeStep: number]} args
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

  function handleToggleExclusion({ isOn }) {
    let isExclusion = !isOn;
    onToggleExclusion(isExclusion);
    setState((prevState) => ({
      ...prevState,
      isExclusion
    }));
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
        {['AND', 'OR'].map(
          (/** @type {FilterSectionState['combineMode']} */ combineMode) => (
            <label key={combineMode}>
              <input
                checked={state.combineMode === combineMode}
                name='combineMode'
                onChange={handleSetCombineModeOption}
                value={combineMode}
                type='radio'
              />
              {combineMode}
            </label>
          )
        )}
        <Tooltip
          arrowContent={<div className='rc-tooltip-arrow-inner' />}
          overlay={tooltipText}
          overlayClassName='g3-filter-section__and-or-toggle-helper-tooltip'
          placement='right'
          trigger={['hover', 'focus']}
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
        className={
          state.isExpanded ? '' : 'g3-filter-section__search-filter--hidden'
        }
        controlShouldRenderValue={false}
        debounceTimeout={250}
        defaultOptions
        onChange={(option) => handleSelectSingleSelectFilter(option.value)}
        loadOptions={(input, loadedOptions) =>
          onSearchFilterLoadOptions?.(input, loadedOptions.length)
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
    return /** @type {RangeFilterOption[]} */ (options).map((option) => {
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
    });
  }

  /** @param {OptionFilterStatus} filterStatus */
  function renderTextFilter(filterStatus) {
    // For searchFilters, options are treated differently -- the only
    // options passed are the already selected options, as opposed
    // to all available options in textfilters. So don't filter out
    // any options based on `optionsVisibleStatus`.
    // We use the 'key' prop to force the SingleSelectFilter
    // to rerender on filterStatus change.
    // See https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key
    return (
      <>
        <div>
          Filter Mode
          <ButtonToggle 
            isOn={!state.isExclusion}
            onText='Include'
            offText='Exclude' 
            onToggle={handleToggleExclusion}
          />
        </div>
        {options.map(
          (option) =>
            (isSearchFilter || state.optionsVisibleStatus[option.text]) && (
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
              />
            )
        )}
      </>
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
                  handleClearButtonClick();
                }
              }}
              role='button'
              tabIndex={0}
            >
              <div className='g3-filter-section__range-filter-clear-btn-text'>
                reset
              </div>
              <div className='g3-filter-section__range-filter-clear-btn-icon'>
                <i className='g3-icon g3-icon--sm g3-icon-color__lightgray g3-icon--undo' />
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
                  &nbsp;{`${state.isExclusion ? 'excluded' : 'selected'}`}
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
      {state.isExpanded &&
        (options.length > 0 ? (
          <div className='g3-filter-section__options'>
            {(isTextFilter || isSearchFilter) &&
              renderTextFilter(
                /** @type {OptionFilterStatus} */ (filterStatus)
              )}
            {isRangeFilter &&
              renderRangeFilter(
                /** @type {RangeFilterStatus} */ (filterStatus)
              )}
            {isTextFilter && state.isSearchInputEmpty && renderShowMoreButton()}
          </div>
        ) : (
          <div className='g3-filter-section__no-option'>No data</div>
        ))}
    </div>
  );
}

FilterSection.propTypes = {
  expanded: PropTypes.bool,
  excluded: PropTypes.bool,
  sectionTitle: PropTypes.string,
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
  onToggleExclusion: PropTypes.func,
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
  title: PropTypes.string,
  tooltip: PropTypes.string,
  lockedTooltipMessage: PropTypes.string,
  disabledTooltipMessage: PropTypes.string,
};

export default FilterSection;
