import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap_white.css';
import { Radio } from 'antd';
import 'antd/dist/antd.css';
import { AsyncPaginate } from 'react-select-async-paginate';
import SingleSelectFilter from '../SingleSelectFilter';
import Chip from '../Chip';
import RangeFilter from '../RangeFilter';
import './FilterSection.css';

const filterVisibleStatusObj = (optionList, inputText) => {
  const res = {};
  optionList.forEach((o) => {
    if (typeof inputText === 'undefined') {
      res[o.text] = true;
    } else {
      const matched = o.text.toLowerCase().indexOf(inputText.toLowerCase()) >= 0;
      res[o.text] = matched;
    }
  });
  return res;
};

const getNumValuesSelected = (filterStatus) => {
  let numSelected = 0;
  if (Array.isArray(filterStatus)) {
    numSelected = 1;
    return numSelected;
  }
  const statuses = Object.values(filterStatus);
  statuses.forEach((status) => {
    if (status === true || Array.isArray(status)) {
      numSelected += 1;
    }
  });
  return numSelected;
};

class FilterSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isExpanded: this.props.expanded,
      showingMore: false,
      filterStatus: {}, // shape: { [fieldName]: true | false } | [number, number]
      searchInputEmpty: true,
      showingSearch: false,
      showingAndOrToggle: false,
      combineMode: 'OR',

      // used for rerendering child components when reset button is clicked
      resetClickCounter: 0,

      // option visible status filtered by the search inputbox
      optionsVisibleStatus: filterVisibleStatusObj(this.props.options),
    };
    this.inputElem = React.createRef();
    this.combineModeFieldName = '__combineMode';
  }

  getSearchInput() {
    const isHidden = !this.state.showingSearch || !this.state.isExpanded;
    return (
      <div className={`g3-filter-section__search-input ${isHidden && 'g3-filter-section__hidden'}`}>
        <input
          className='g3-filter-section__search-input-box body'
          onChange={() => { this.handleSearchInputChange(); }}
          ref={this.inputElem}
        />
        <i
          className={`g3-icon g3-icon--${this.state.searchInputEmpty ? 'search' : 'cross'} g3-filter-section__search-input-close`}
          onClick={() => this.state.searchInputEmpty || this.clearSearchInput()}
          onKeyPress={() => this.state.searchInputEmpty || this.clearSearchInput()}
          role='button'
          tabIndex={0}
        />
      </div>
    );
  }

  getAndOrToggle() {
    const isHidden = !this.state.showingAndOrToggle || !this.state.isExpanded;
    const tooltipText = 'This toggle selects the logical operator used to combine checked filter options. '
      + 'If AND is set, records must match all checked filter options. '
      + 'If OR is set, records must match at least one checked option.';
    return (
      <React.Fragment>
        <div className={`g3-filter-section__and-or-toggle ${isHidden && 'g3-filter-section__hidden'}`}>
          <span style={{ marginRight: '5px' }}>Combine with </span>
          <Radio.Group defaultValue={this.state.combineMode} buttonStyle='solid'>
            <Radio.Button value='AND' onChange={() => this.handleSetCombineModeOption('AND')}>
            AND
            </Radio.Button>
            <Radio.Button value='OR' onChange={() => this.handleSetCombineModeOption('OR')}>
              OR
            </Radio.Button>
          </Radio.Group>

          <Tooltip
            placement='right'
            overlay={tooltipText}
            overlayClassName='g3-filter-section__and-or-toggle-helper-tooltip'
            arrowContent={<div className='rc-tooltip-arrow-inner' />}
            width='300px'
            trigger={['hover', 'focus']}
          >
            <span className='g3-helper-tooltip'>
              <i className='g3-icon g3-icon--sm g3-icon--question-mark-bootstrap help-tooltip-icon' />
            </span>
          </Tooltip>

        </div>
      </React.Fragment>
    );
  }

  getSearchFilter() {
    const selectedOptions = Object.entries(this.state.filterStatus)
      .filter(kv => kv[1] === true)
      .map(kv => ({ value: kv[0], label: kv[0] }));
    return (
      <AsyncPaginate
        className={`${this.state.isExpanded ? '' : 'g3-filter-section__search-filter--hidden'}`}
        cacheOptions
        controlShouldRenderValue={false}
        defaultOptions
        debounceTimeout={250}
        value={selectedOptions}
        loadOptions={(input, loadedOptions) => this.props.onSearchFilterLoadOptions(
          input, loadedOptions.length)}
        onChange={option => this.handleSelectSingleSelectFilter(option.value)}
      />
    );
  }


  getShowMoreButton() {
    if (this.state.isExpanded) {
      const totalCount = this.props.options
        .filter(o => (o.count > 0 || !this.props.hideZero || o.count === -1))
        .filter(o => this.state.optionsVisibleStatus[o.text])
        .length;
      if ((totalCount > this.props.initVisibleItemNumber)) {
        if (this.state.showingMore) {
          return (
            <div
              className='g3-filter-section__show-more'
              role='button'
              onClick={() => this.toggleShowMore()}
              onKeyPress={() => this.toggleShowMore()}
              tabIndex={0}
            >
              less
            </div>
          );
        }
        const moreCount = totalCount - this.props.initVisibleItemNumber;
        return (
          <div
            className='g3-filter-section__show-more'
            role='button'
            onClick={() => this.toggleShowMore()}
            onKeyPress={() => this.toggleShowMore()}
            tabIndex={0}
          >
            {moreCount}
            &nbsp;more
          </div>
        );
      }
      return null;
    }
    return null;
  }

  handleSetCombineModeOption(combineModeIn) {
    // Combine mode: AND or OR
    this.setState({ combineMode: combineModeIn });
    this.props.onCombineOptionToggle(this.combineModeFieldName, combineModeIn);
  }


  handleClearButtonClick(ev) {
    // Prevent this click from triggering any onClick events in parent component
    ev.stopPropagation();
    // Clear the filters
    this.setState(prevState => ({
      filterStatus: {},
      resetClickCounter: prevState.resetClickCounter + 1,
    }));
    this.props.onClear();
  }

  handleSearchInputChange() {
    const currentInput = this.inputElem.current.value;
    this.setState({
      searchInputEmpty: !currentInput || currentInput.length === 0,
    });
    this.updateVisibleOptions(currentInput);
  }

  clearSearchInput() {
    this.inputElem.current.value = '';
    this.setState({
      searchInputEmpty: true,
    });
    this.updateVisibleOptions();
  }

  updateVisibleOptions(inputText) {
    // if empty input, all should be visible
    if (typeof inputText === 'undefined' || inputText.trim() === '') {
      this.setState({
        optionsVisibleStatus: filterVisibleStatusObj(this.props.options),
      });
    }

    // if not empty, filter out those matched
    this.setState({
      optionsVisibleStatus: filterVisibleStatusObj(this.props.options, inputText),
    });
  }

  toggleSection(open) {
    let targetStatus;
    if (typeof open === 'undefined') {
      targetStatus = !this.state.isExpanded;
    } else {
      targetStatus = open;
    }
    this.props.onToggle(targetStatus);
    this.setState({ isExpanded: targetStatus });
  }

  handleSelectSingleSelectFilter(label) {
    this.setState((prevState) => {
      const newFilterStatus = Object.assign({}, prevState.filterStatus);
      const oldSelected = newFilterStatus[label];
      const newSelected = typeof oldSelected === 'undefined' ? true : !oldSelected;
      newFilterStatus[label] = newSelected;
      return {
        filterStatus: newFilterStatus,
      };
    });
    this.props.onSelect(label);
  }

  handleDragRangeFilter(lowerBound, upperBound, minValue, maxValue, rangeStep) {
    this.setState(() => {
      const newFilterStatus = [lowerBound, upperBound];
      return {
        filterStatus: newFilterStatus,
      };
    });
    this.props.onAfterDrag(lowerBound, upperBound, minValue, maxValue, rangeStep);
  }

  toggleShowSearch() {
    // If and/or toggle is shown, hide it before showing the search input.
    this.setState(prevState => (
      { showingSearch: !prevState.showingSearch, showingAndOrToggle: false }),
    );
  }

  toggleShowAndOrToggle() {
    // If search input is shown, hide it before showing the and/or toggle.
    this.setState(prevState => (
      { showingAndOrToggle: !prevState.showingAndOrToggle, showingSearch: false }),
    );
  }

  toggleShowMore() {
    this.setState(prevState => ({ showingMore: !prevState.showingMore }));
  }


  render() {
    // Takes in parent component's filterStatus or self state's filterStatus
    const filterStatus = this.props.filterStatus
      ? this.props.filterStatus : this.state.filterStatus;
    let isSearchFilter = false;
    let isTextFilter = false;
    let isRangeFilter = false;
    if (this.props.isSearchFilter) {
      isSearchFilter = true;
    } else if (this.props.options.length > 0 && this.props.options[0].filterType === 'singleSelect') {
      isTextFilter = true;
    } else {
      isRangeFilter = true;
    }
    const numSelected = getNumValuesSelected(filterStatus);
    const sectionHeader = (
      <div className='g3-filter-section__header'>
        <div className='g3-filter-section__toggle-icon-container'>
          <i
            onClick={() => this.toggleSection()}
            onKeyPress={() => this.toggleSection()}
            tabIndex={0}
            role='button'
            className={`g3-filter-section__toggle-icon g3-icon g3-icon-color__coal 
                g3-icon--sm g3-icon--chevron-${this.state.isExpanded ? 'down' : 'right'}`}
          />
        </div>
        <div
          className='g3-filter-section__title-container'
          onClick={() => this.toggleSection()}
          onKeyPress={() => this.toggleSection()}
          tabIndex={0}
          role='button'
        >
          <div className={`g3-filter-section__title ${numSelected !== 0 ? 'g3-filter-section__title--active' : ''}`}>
            {this.props.title}
          </div>
          { (isRangeFilter && numSelected !== 0)
            && (
              <div className='g3-filter-section__selected-count-chip'>
                <div
                  tabIndex={0}
                  role='button'
                  onClick={ev => this.handleClearButtonClick(ev)}
                  onKeyPress={ev => this.handleClearButtonClick(ev)}
                  className='g3-filter-section__range-filter-clear-btn'
                >
                  <div
                    className='g3-filter-section__range-filter-clear-btn-text'
                  >
                    reset
                  </div>
                  <div
                    className='g3-filter-section__range-filter-clear-btn-icon'
                  >
                    <i className='g3-icon g3-icon--sm g3-icon-color__lightgray g3-icon--sm g3-icon--undo' />
                  </div>
                </div>
              </div>
            )
          }
          { ((isTextFilter || isSearchFilter) && numSelected !== 0)
            && (
              <div className='g3-filter-section__selected-count-chip'>
                <Chip
                  text={
                    (
                      <React.Fragment>
                        <span className='g3-filter-section__selected-count-chip-text-emphasis'>{numSelected}</span>
                        &nbsp;selected
                      </React.Fragment>
                    )
                  }
                  onClearButtonClick={ev => this.handleClearButtonClick(ev)}
                />
              </div>
            )
          }
        </div>
        {
          isTextFilter && this.props.isArrayField && (
            <div
              tabIndex={0}
              role='button'
              onClick={() => this.toggleShowAndOrToggle()}
              onKeyPress={() => this.toggleShowAndOrToggle()}
            >
              <i
                className='g3-filter-section__toggle-icon g3-icon g3-icon--sm g3-icon--gear'
              />
            </div>
          )
        }
        {
          isTextFilter && (
            <div
              tabIndex={0}
              role='button'
              onClick={() => this.toggleShowSearch()}
              onKeyPress={() => this.toggleShowSearch()}
            >
              <i
                className='g3-filter-section__search-icon g3-icon g3-icon--sm g3-icon--search'
              />
            </div>
          )
        }
      </div>
    );
    return (
      <div className='g3-filter-section'>
        {
          this.props.tooltip ? (
            <Tooltip
              placement='topLeft'
              overlay={(<span>{this.props.tooltip}</span>)}
              arrowContent={<div className='rc-tooltip-arrow-inner' />}
              overlayClassName='g3-filter-section__tooltip'
            >
              {sectionHeader}
            </Tooltip>
          ) : sectionHeader
        }
        {
          isTextFilter && this.getSearchInput()
        }
        {
          this.props.isArrayField && this.getAndOrToggle()
        }
        {
          isSearchFilter && this.getSearchFilter(Option)
        }
        <div className='g3-filter-section__options'>
          {
            ((isTextFilter || isSearchFilter) && this.state.isExpanded)
              ? this.props.options
                .filter((option) => {
                  if (isSearchFilter) {
                    // For searchFilters, options are treated differently -- the only
                    // options passed are the already selected options, as opposed
                    // to all available options in textfilters. So don't filter out
                    // any options based on `optionsVisibleStatus`.
                    return true;
                  }
                  return this.state.optionsVisibleStatus[option.text];
                })
                .map((option, index) => {
                  if (index >= this.props.initVisibleItemNumber && !this.state.showingMore) {
                    return null;
                  }
                  return (
                    // We use the 'key' prop to force the SingleSelectFilter
                    // to rerender on filterStatus change.
                    // See https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key
                    <SingleSelectFilter
                      key={`${option.text}-${filterStatus[option.text] ? 'enabled' : 'disabled'}`}
                      label={option.text}
                      onSelect={label => this.handleSelectSingleSelectFilter(label)}
                      selected={filterStatus[option.text]}
                      count={isSearchFilter ? null : option.count}
                      hideZero={this.props.hideZero}
                      accessible={option.accessible}
                      tierAccessLimit={this.props.tierAccessLimit}
                      disabled={option.disabled}
                      lockedTooltipMessage={this.props.lockedTooltipMessage}
                      disabledTooltipMessage={this.props.disabledTooltipMessage}
                    />
                  );
                }) : null
          }
          {
            (isRangeFilter && this.state.isExpanded)
              ? this.props.options
                .filter(option => this.state.optionsVisibleStatus[option.text])
                .map((option, index) => {
                  if (index >= this.props.initVisibleItemNumber && !this.state.showingMore) {
                    return null;
                  }
                  const lowerBound = (typeof filterStatus === 'undefined'
                  || filterStatus.length !== 2)
                    ? undefined : filterStatus[0];
                  const upperBound = (typeof filterStatus === 'undefined'
                  || filterStatus.length !== 2)
                    ? undefined : filterStatus[1];
                  // We use the 'key' prop to force the SingleSelectFilter
                  // to rerender if the `reset` button is clicked.
                  // Each reset button click increments the counter and changes the key.
                  // See https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key
                  const key = `${option.text}-${option.min}-${option.max}-${lowerBound}-${upperBound}-${this.state.resetClickCounter}`;
                  // NOTE: We set hideValue={-1} here because Guppy returns a count of -1
                  // when the count is hidden from the end user.
                  const hideValue = -1;
                  return (
                    <RangeFilter
                      key={key}
                      label={option.text}
                      min={option.min}
                      max={option.max}
                      onAfterDrag={(lb, ub, min, max, step) => this.handleDragRangeFilter(
                        lb, ub, min, max, step)}
                      lowerBound={lowerBound}
                      upperBound={upperBound}
                      inactive={lowerBound === undefined && upperBound === undefined}
                      count={option.count}
                      hideValue={hideValue}
                    />
                  );
                }) : null
          }
          {isTextFilter && this.getShowMoreButton()}
        </div>
      </div>
    );
  }
}

FilterSection.propTypes = {
  title: PropTypes.string,
  tooltip: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape({
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

  })),
  onSelect: PropTypes.func.isRequired,
  onCombineOptionToggle: PropTypes.func,
  onAfterDrag: PropTypes.func.isRequired,
  onClear: PropTypes.func,
  expanded: PropTypes.bool,
  onToggle: PropTypes.func,
  filterStatus: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.number),
  ]),
  initVisibleItemNumber: PropTypes.number,
  hideZero: PropTypes.bool,
  tierAccessLimit: PropTypes.number,
  lockedTooltipMessage: PropTypes.string,
  disabledTooltipMessage: PropTypes.string,
  isSearchFilter: PropTypes.bool,
  onSearchFilterLoadOptions: PropTypes.func,
  isArrayField: PropTypes.bool,
};

FilterSection.defaultProps = {
  title: '',
  tooltip: null,
  options: [],
  expanded: true,
  onToggle: () => {},
  onClear: () => {},
  onCombineOptionToggle: () => {},
  filterStatus: undefined,
  initVisibleItemNumber: 5,
  hideZero: true,
  tierAccessLimit: undefined,
  lockedTooltipMessage: '',
  disabledTooltipMessage: '',
  isSearchFilter: false,
  isArrayField: false,
  onSearchFilterLoadOptions: () => null,
};

export default FilterSection;
