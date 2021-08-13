import React from 'react';
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

const filterVisibleStatusObj = (
  optionList,
  initVisibleItemNumber,
  isShowingMoreOptions,
  inputText
) => {
  const res = {};
  for (const [i, o] of optionList.entries()) {
    res[o.text] =
      inputText === undefined || inputText.trim() === ''
        ? isShowingMoreOptions || i < initVisibleItemNumber
        : o.text.toLowerCase().indexOf(inputText.toLowerCase()) >= 0;
  }
  return res;
};

const getNumValuesSelected = (filterStatus) => {
  if (Array.isArray(filterStatus)) return 1;

  let numSelected = 0;
  for (const status of Object.values(filterStatus))
    if (status === true || Array.isArray(status)) numSelected += 1;

  return numSelected;
};

class FilterSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      combineMode: 'OR',
      filterStatus: {}, // shape: { [fieldName]: true | false } | [number, number]
      isExpanded: this.props.expanded,
      isSearchInputEmpty: true,
      isShowingCombineMode: false,
      isShowingMoreOptions: false,
      isShowingSearch: false,
      // option visible status filtered by the search inputbox
      optionsVisibleStatus: filterVisibleStatusObj(
        this.props.options,
        this.props.initVisibleItemNumber,
        false
      ),
      // used for rerendering child components when reset button is clicked
      resetClickCounter: 0,
    };
    this.inputElem = React.createRef();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.options !== this.props.options) this.updateVisibleOptions();
  }

  clearSearchInput = () => {
    this.inputElem.current.value = '';
    this.setState({ isSearchInputEmpty: true });
    this.updateVisibleOptions();
  };

  handleSetCombineModeOption = (combineMode) => {
    // Combine mode: AND or OR
    this.setState({ combineMode });
    this.props.onToggleCombineMode('__combineMode', combineMode);
  };

  handleClearButtonClick = (ev) => {
    // Prevent this click from triggering any onClick events in parent component
    ev.stopPropagation();
    // Clear the filters
    this.setState((prevState) => ({
      filterStatus: {},
      resetClickCounter: prevState.resetClickCounter + 1,
    }));
    this.props.onClear();
  };

  handleSearchInputChange = () => {
    const currentInput = this.inputElem.current.value;
    this.setState({
      isSearchInputEmpty: !currentInput || currentInput.length === 0,
    });
    this.updateVisibleOptions(currentInput);
  };

  handleSelectSingleSelectFilter = (label) => {
    this.setState((prevState) => {
      const newFilterStatus = { ...prevState.filterStatus };
      const isSelected = newFilterStatus[label];
      newFilterStatus[label] = isSelected === undefined || !isSelected;
      return {
        filterStatus: newFilterStatus,
      };
    });
    this.props.onSelect(label);
  };

  handleDragRangeFilter = (
    lowerBound,
    upperBound,
    minValue,
    maxValue,
    rangeStep
  ) => {
    this.setState({ filterStatus: [lowerBound, upperBound] });
    this.props.onAfterDrag(
      lowerBound,
      upperBound,
      minValue,
      maxValue,
      rangeStep
    );
  };

  toggleIsExpanded = (open) => {
    const { isExpanded } = this.state;
    const newIsExpanded = open ?? !isExpanded;
    this.props.onToggle(newIsExpanded);
    this.setState({ isExpanded: newIsExpanded });
  };

  toggleIsShowingCombineMode = () => {
    // If search input is shown, hide it before showing the and/or toggle.
    this.setState((prevState) => ({
      isShowingCombineMode: !prevState.isShowingCombineMode,
      isShowingSearch: false,
    }));
  };

  toggleIsShowingMoreOptions = () => {
    this.setState((prevState) => ({
      isShowingMoreOptions: !prevState.isShowingMoreOptions,
      optionsVisibleStatus: filterVisibleStatusObj(
        this.props.options,
        this.props.initVisibleItemNumber,
        !prevState.isShowingMoreOptions
      ),
    }));
  };

  toggleIsShowingSearch = () => {
    // If and/or toggle is shown, hide it before showing the search input.
    this.setState((prevState) => ({
      isShowingCombineMode: false,
      isShowingSearch: !prevState.isShowingSearch,
    }));
  };

  updateVisibleOptions = (inputText) => {
    this.setState((prevState) => ({
      optionsVisibleStatus: filterVisibleStatusObj(
        this.props.options,
        this.props.initVisibleItemNumber,
        prevState.isShowingMoreOptions,
        inputText
      ),
    }));
  };

  renderCombineOptionButton() {
    const tooltipText =
      'This toggle selects the logical operator used to combine checked filter options. ' +
      'If AND is set, records must match all checked filter options. ' +
      'If OR is set, records must match at least one checked option.';
    return (
      <div
        className={
          this.state.isExpanded && this.state.isShowingCombineMode
            ? 'g3-filter-section__and-or-toggle'
            : 'g3-filter-section__hidden'
        }
      >
        <span style={{ marginRight: '5px' }}>Combine with </span>
        <Radio.Group
          buttonStyle='solid'
          defaultValue={this.state.combineMode}
          onChange={this.handleSetCombineModeOption}
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

  renderSearchFilter() {
    const selectedOptions = [];
    for (const [value, isSelected] of Object.entries(this.state.filterStatus))
      if (isSelected) selectedOptions.push({ value, label: value });

    return (
      <AsyncPaginate
        cacheOptions
        className={
          this.state.isExpanded
            ? ''
            : 'g3-filter-section__search-filter--hidden'
        }
        controlShouldRenderValue={false}
        debounceTimeout={250}
        defaultOptions
        onChange={(option) => this.handleSelectSingleSelectFilter(option.value)}
        loadOptions={(input, loadedOptions) =>
          this.props.onSearchFilterLoadOptions(input, loadedOptions.length)
        }
        value={selectedOptions}
      />
    );
  }

  renderSearchInput() {
    return (
      <div
        className={
          this.state.isExpanded && this.state.isShowingSearch
            ? 'g3-filter-section__search-input'
            : 'g3-filter-section__hidden'
        }
      >
        <input
          className='g3-filter-section__search-input-box body'
          onChange={this.handleSearchInputChange}
          ref={this.inputElem}
        />
        <span
          aria-label={this.state.isSearchInputEmpty ? 'Search' : 'Clear'}
          className=''
          onClick={
            this.state.isSearchInputEmpty ? undefined : this.clearSearchInput
          }
          onKeyPress={(e) => {
            if (this.state.isSearchInputEmpty) return;

            if (e.charCode === 13 || e.charCode === 32) {
              e.preventDefault();
              this.clearSearchInput();
            }
          }}
          role='button'
          tabIndex={0}
        >
          <i
            className={`g3-icon g3-icon--${
              this.state.isSearchInputEmpty ? 'search' : 'cross'
            } g3-filter-section__search-input-close`}
          />
        </span>
      </div>
    );
  }

  renderShowMoreButton() {
    let totalCount = 0;
    for (const o of this.props.options)
      if (o.count > 0 || !this.props.hideZero || o.count === -1)
        totalCount += 1;

    return (
      totalCount > this.props.initVisibleItemNumber && (
        <div
          aria-label={
            this.state.isShowingMoreOptions ? 'Show less' : 'Show more'
          }
          className='g3-filter-section__show-more'
          onClick={this.toggleIsShowingMoreOptions}
          onKeyPress={(e) => {
            if (e.charCode === 13 || e.charCode === 32) {
              e.preventDefault();
              this.toggleIsShowingMoreOptions();
            }
          }}
          role='button'
          tabIndex={0}
        >
          {this.state.isShowingMoreOptions
            ? 'less'
            : `${(
                totalCount - this.props.initVisibleItemNumber
              ).toLocaleString()} more`}
        </div>
      )
    );
  }

  render() {
    // Takes in parent component's filterStatus or self state's filterStatus
    const filterStatus = this.props.filterStatus
      ? this.props.filterStatus
      : this.state.filterStatus;
    let isSearchFilter = false;
    let isTextFilter = false;
    let isRangeFilter = false;
    if (this.props.isSearchFilter) {
      isSearchFilter = true;
    } else if (
      this.props.options.length > 0 &&
      this.props.options[0].filterType === 'singleSelect'
    ) {
      isTextFilter = true;
    } else {
      isRangeFilter = true;
    }
    const numSelected = getNumValuesSelected(filterStatus);
    const sectionHeader = (
      <div className='g3-filter-section__header'>
        <div
          aria-label={`${
            this.state.isExpanded ? 'Collapse' : 'Expand'
          } filter: ${this.props.title}`}
          className='g3-filter-section__title-container'
          onClick={() => this.toggleIsExpanded()}
          onKeyPress={(e) => {
            if (e.charCode === 13 || e.charCode === 32) {
              e.preventDefault();
              this.toggleIsExpanded();
            }
          }}
          role='button'
          tabIndex={0}
        >
          <div className='g3-filter-section__toggle-icon-container'>
            <i
              className={`g3-filter-section__toggle-icon g3-icon g3-icon-color__coal 
                g3-icon--sm g3-icon--chevron-${
                  this.state.isExpanded ? 'down' : 'right'
                }`}
            />
          </div>
          <div
            className={`g3-filter-section__title ${
              numSelected !== 0 ? 'g3-filter-section__title--active' : ''
            }`}
          >
            {this.props.title}
          </div>
          {isRangeFilter && numSelected !== 0 && (
            <div className='g3-filter-section__selected-count-chip'>
              <div
                aria-label='Reset filter'
                className='g3-filter-section__range-filter-clear-btn'
                onClick={this.handleClearButtonClick}
                onKeyPress={(e) => {
                  if (e.keyCode === 13 || e.keyCode === 32) {
                    e.preventDefault();
                    this.handleClearButtonClick(e);
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
                onClearButtonClick={this.handleClearButtonClick}
              />
            </div>
          )}
        </div>
        {isTextFilter && this.props.isArrayField && (
          <div
            aria-label={
              this.state.isShowingCombineMode
                ? 'Hide filter combine mode'
                : 'Show filter combine mode'
            }
            onClick={this.toggleIsShowingCombineMode}
            onKeyPress={(e) => {
              if (e.charCode === 13 || e.charCode === 32) {
                e.preventDefault();
                this.toggleIsShowingCombineMode();
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
            aria-label={
              this.state.isShowingSearch ? 'Hide search' : 'Show search'
            }
            onClick={this.toggleIsShowingSearch}
            onKeyPress={(e) => {
              if (e.charCode === 13 || e.charCode === 32) {
                e.preventDefault();
                this.toggleIsShowingSearch();
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
        {this.props.tooltip ? (
          <Tooltip
            arrowContent={<div className='rc-tooltip-arrow-inner' />}
            overlay={<span>{this.props.tooltip}</span>}
            overlayClassName='g3-filter-section__tooltip'
            placement='topLeft'
          >
            {sectionHeader}
          </Tooltip>
        ) : (
          sectionHeader
        )}
        {isTextFilter && this.renderSearchInput()}
        {this.props.isArrayField && this.renderCombineOptionButton()}
        {isSearchFilter && this.renderSearchFilter()}
        <div className='g3-filter-section__options'>
          {(isTextFilter || isSearchFilter) &&
            this.state.isExpanded &&
            this.props.options.map((option) => {
              if (
                // For searchFilters, options are treated differently -- the only
                // options passed are the already selected options, as opposed
                // to all available options in textfilters. So don't filter out
                // any options based on `optionsVisibleStatus`.
                !isSearchFilter &&
                !this.state.optionsVisibleStatus[option.text]
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
                  disabledTooltipMessage={this.props.disabledTooltipMessage}
                  hideZero={this.props.hideZero}
                  label={option.text}
                  lockedTooltipMessage={this.props.lockedTooltipMessage}
                  onSelect={this.handleSelectSingleSelectFilter}
                  selected={filterStatus[option.text]}
                  tierAccessLimit={this.props.tierAccessLimit}
                />
              );
            })}
          {isRangeFilter &&
            this.state.isExpanded &&
            this.props.options.map((option) => {
              if (!this.state.optionsVisibleStatus[option.text]) {
                return null;
              }
              const lowerBound =
                typeof filterStatus === 'undefined' || filterStatus.length !== 2
                  ? undefined
                  : filterStatus[0];
              const upperBound =
                typeof filterStatus === 'undefined' || filterStatus.length !== 2
                  ? undefined
                  : filterStatus[1];
              return (
                // We use the 'key' prop to force the SingleSelectFilter
                // to rerender if the `reset` button is clicked.
                // Each reset button click increments the counter and changes the key.
                // See https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key
                <RangeFilter
                  key={`${option.text}-${option.min}-${option.max}-${lowerBound}-${upperBound}-${this.state.resetClickCounter}`}
                  count={option.count}
                  // NOTE: Guppy returns a count of -1 when the count is hidden from the end user.
                  hideValue={-1}
                  inactive={
                    lowerBound === undefined && upperBound === undefined
                  }
                  label={option.text}
                  max={option.max}
                  min={option.min}
                  lowerBound={lowerBound}
                  upperBound={upperBound}
                  onAfterDrag={this.handleDragRangeFilter}
                />
              );
            })}
          {isTextFilter &&
            this.state.isExpanded &&
            this.state.isSearchInputEmpty &&
            this.renderShowMoreButton()}
        </div>
      </div>
    );
  }
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

FilterSection.defaultProps = {
  disabledTooltipMessage: '',
  expanded: true,
  hideZero: true,
  initVisibleItemNumber: 5,
  isArrayField: false,
  isSearchFilter: false,
  lockedTooltipMessage: '',
  onClear: () => {},
  onSearchFilterLoadOptions: () => null,
  onToggle: () => {},
  onToggleCombineMode: () => {},
  options: [],
  tierAccessLimit: undefined,
  title: '',
  tooltip: null,
};

export default FilterSection;
