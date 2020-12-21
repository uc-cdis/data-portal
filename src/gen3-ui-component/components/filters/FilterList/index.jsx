import React from 'react';
import PropTypes from 'prop-types';
import FilterSection from '../FilterSection';
import './FilterList.css';

class FilterList extends React.Component {
  constructor(props) {
    super(props);
    const initialFilterStatus = props.sections
      .map(() => ({}));
    this.state = {
      /**
       * Current selected status for filters,
       * filterStatus[sectionIndex] = { [field]: true/false/[upperBound,lowerBound]}
       */
      filterStatus: initialFilterStatus,
    };
    this.sectionRefs = props.sections.map(() => React.createRef());
  }

  handleSectionToggle(sectionIndex, newExpanded) {
    this.props.onToggle(sectionIndex, newExpanded);
  }

  handleSectionClear(sectionIndex) {
    this.setState((prevState) => {
      const newFilterStatus = prevState.filterStatus.slice(0);
      newFilterStatus[sectionIndex] = {};
      return {
        filterStatus: newFilterStatus,
      };
    });
    this.props.onClear(sectionIndex);
  }

  handleSelectSingleFilter(
    sectionIndex,
    singleFilterLabel,
  ) {
    this.setState((prevState) => {
      const newFilterStatus = prevState.filterStatus.slice(0);
      const oldSelected = newFilterStatus[sectionIndex][singleFilterLabel];
      const newSelected = typeof oldSelected === 'undefined' ? true : !oldSelected;
      newFilterStatus[sectionIndex][singleFilterLabel] = newSelected;
      return {
        filterStatus: newFilterStatus,
      };
    });
    this.props.onSelect(sectionIndex, singleFilterLabel);
  }

  handleSelectCombineOptionToggle(
    sectionIndex,
    fieldName,
    value,
  ) {
    this.setState((prevState) => {
      const newFilterStatus = prevState.filterStatus.slice(0);
      newFilterStatus[sectionIndex][fieldName] = value;
      return {
        filterStatus: newFilterStatus,
      };
    });
    this.props.onCombineOptionToggle(sectionIndex, fieldName, value);
  }

  handleDragRangeFilter(sectionIndex, lowerBound, upperBound, minValue, maxValue, rangeStep) {
    this.setState((prevState) => {
      const newFilterStatus = prevState.filterStatus.slice(0);
      newFilterStatus[sectionIndex] = [lowerBound, upperBound];
      return {
        filterStatus: newFilterStatus,
      };
    });
    this.props.onAfterDrag(sectionIndex, lowerBound, upperBound, minValue, maxValue, rangeStep);
  }

  toggleFilters(openAll) {
    this.sectionRefs.forEach((ref) => {
      ref.current.toggleSection(openAll);
    });
  }

  render() {
    // Takes in parent component's filterStatus or self state's filterStatus
    const filterStatus = this.props.filterStatus
      ? this.props.filterStatus : this.state.filterStatus;

    return (
      <div className='g3-filter-list'>
        {
          this.props.sections.map((section, index) => (
            <FilterSection
              key={index}
              ref={this.sectionRefs[index]}
              title={section.title}
              tooltip={section.tooltip}
              options={section.options}
              isSearchFilter={section.isSearchFilter}
              isArrayField={section.isArrayField}
              onSearchFilterLoadOptions={section.onSearchFilterLoadOptions}
              expanded={this.props.expandedStatus[index]}
              onToggle={newExpanded => this.handleSectionToggle(index, newExpanded)}
              onClear={() => this.handleSectionClear(index)}
              filterStatus={filterStatus[index]}
              onSelect={
                singleFilterLabel => this.handleSelectSingleFilter(
                  index,
                  singleFilterLabel,
                )
              }
              onCombineOptionToggle={
                (combineModeFieldName, combineModeValue) => this.handleSelectCombineOptionToggle(
                  index,
                  combineModeFieldName,
                  combineModeValue,
                )
              }
              onAfterDrag={
                (...args) => this.handleDragRangeFilter(index, ...args)
              }
              hideZero={this.props.hideZero}
              tierAccessLimit={this.props.tierAccessLimit}
              lockedTooltipMessage={this.props.lockedTooltipMessage}
              disabledTooltipMessage={this.props.disabledTooltipMessage}
            />
          ))
        }
      </div>
    );
  }
}

FilterList.propTypes = {
  sections: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    tooltip: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string,
      filterType: PropTypes.oneOf(['singleSelect', 'range']),

      // for single select filter
      count: PropTypes.number,
      hideZero: PropTypes.bool,
      accessible: PropTypes.bool,
      disabled: PropTypes.bool,

      // for range filter
      min: PropTypes.number,
      max: PropTypes.number,
    })),
  })).isRequired,
  expandedStatus: PropTypes.arrayOf(PropTypes.bool),
  onToggle: PropTypes.func,
  onClear: PropTypes.func,
  filterStatus: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.arrayOf(PropTypes.number),
  ])),
  onSelect: PropTypes.func,
  onCombineOptionToggle: PropTypes.func,
  onAfterDrag: PropTypes.func,
  hideZero: PropTypes.bool,
  tierAccessLimit: PropTypes.number,
  lockedTooltipMessage: PropTypes.string,
  disabledTooltipMessage: PropTypes.string,
};

FilterList.defaultProps = {
  expandedStatus: [],
  onToggle: () => {},
  onClear: () => {},
  filterStatus: undefined,
  onSelect: () => {},
  onCombineOptionToggle: () => {},
  onAfterDrag: () => {},
  hideZero: true,
  tierAccessLimit: undefined,
  lockedTooltipMessage: '',
  disabledTooltipMessage: '',
};

export default FilterList;
