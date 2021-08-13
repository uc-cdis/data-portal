import React from 'react';
import PropTypes from 'prop-types';
import FilterSection from '../FilterSection';
import './FilterList.css';

class FilterList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      /**
       * Current selected status for filters,
       * filterStatus[sectionIndex] = { [field]: true/false/[upperBound,lowerBound]}
       */
      filterStatus: props.sections.map(() => ({})),
    };
    this.sectionRefs = props.sections.map(() => React.createRef());
  }

  handleDragRangeFilter(
    sectionIndex,
    lowerBound,
    upperBound,
    minValue,
    maxValue,
    rangeStep
  ) {
    this.setState((prevState) => {
      const newFilterStatus = [...prevState.filterStatus];
      newFilterStatus[sectionIndex] = [lowerBound, upperBound];
      return {
        filterStatus: newFilterStatus,
      };
    });
    this.props.onAfterDrag(
      sectionIndex,
      lowerBound,
      upperBound,
      minValue,
      maxValue,
      rangeStep
    );
  }

  handleClearSection(sectionIndex) {
    this.setState((prevState) => {
      const newFilterStatus = [...prevState.filterStatus];
      newFilterStatus[sectionIndex] = {};
      return {
        filterStatus: newFilterStatus,
      };
    });
    this.props.onClearSection(sectionIndex);
  }

  handleSelectSingleFilter(sectionIndex, label) {
    this.setState((prevState) => {
      const newFilterStatus = [...prevState.filterStatus];
      const isSelected = newFilterStatus[sectionIndex][label];
      newFilterStatus[sectionIndex][label] =
        isSelected === undefined || !isSelected;
      return {
        filterStatus: newFilterStatus,
      };
    });
    this.props.onSelect(sectionIndex, label);
  }

  handleToggleCombineMode(sectionIndex, fieldName, value) {
    this.setState((prevState) => {
      const newFilterStatus = [...prevState.filterStatus];
      newFilterStatus[sectionIndex][fieldName] = value;
      return {
        filterStatus: newFilterStatus,
      };
    });
    this.props.onToggleCombineMode(sectionIndex, fieldName, value);
  }

  handleToggleSection(sectionIndex, isExpanded) {
    this.props.onToggleSection(sectionIndex, isExpanded);
  }

  toggleSections(isExpanded) {
    this.sectionRefs.forEach((ref) => {
      ref.current.toggleIsExpanded(isExpanded);
    });
  }

  render() {
    // Takes in parent component's filterStatus or self state's filterStatus
    const filterStatus = this.props.filterStatus ?? this.state.filterStatus;

    return (
      <div className='g3-filter-list'>
        {this.props.sections.map((section, index) => (
          <FilterSection
            key={index}
            ref={this.sectionRefs[index]}
            disabledTooltipMessage={this.props.disabledTooltipMessage}
            expanded={this.props.expandedStatus[index]}
            filterStatus={filterStatus[index]}
            hideZero={this.props.hideZero}
            isArrayField={section.isArrayField}
            isSearchFilter={section.isSearchFilter}
            lockedTooltipMessage={this.props.lockedTooltipMessage}
            onAfterDrag={(...args) =>
              this.handleDragRangeFilter(index, ...args)
            }
            onClear={() => this.handleClearSection(index)}
            onSearchFilterLoadOptions={section.onSearchFilterLoadOptions}
            onSelect={(label) => this.handleSelectSingleFilter(index, label)}
            onToggle={(isExpanded) =>
              this.handleToggleSection(index, isExpanded)
            }
            onToggleCombineMode={(...args) =>
              this.handleToggleCombineMode(index, ...args)
            }
            options={section.options}
            tierAccessLimit={this.props.tierAccessLimit}
            title={section.title}
            tooltip={section.tooltip}
          />
        ))}
      </div>
    );
  }
}

FilterList.propTypes = {
  disabledTooltipMessage: PropTypes.string,
  expandedStatus: PropTypes.arrayOf(PropTypes.bool),
  filterStatus: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.object, PropTypes.arrayOf(PropTypes.number)])
  ),
  hideZero: PropTypes.bool,
  lockedTooltipMessage: PropTypes.string,
  onAfterDrag: PropTypes.func,
  onToggleSection: PropTypes.func,
  onClearSection: PropTypes.func,
  onSelect: PropTypes.func,
  onToggleCombineMode: PropTypes.func,
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      tooltip: PropTypes.string,
      options: PropTypes.arrayOf(
        PropTypes.shape({
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
        })
      ),
    })
  ).isRequired,
  tierAccessLimit: PropTypes.number,
};

FilterList.defaultProps = {
  disabledTooltipMessage: '',
  expandedStatus: [],
  filterStatus: undefined,
  hideZero: true,
  lockedTooltipMessage: '',
  onAfterDrag: () => {},
  onClearSection: () => {},
  onSelect: () => {},
  onToggleCombineMode: () => {},
  onToggleSection: () => {},
  tierAccessLimit: undefined,
};

export default FilterList;
