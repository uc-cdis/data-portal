import React from 'react';
import PropTypes from 'prop-types';
import FilterSection from '../FilterSection';
import './FilterList.css';

class FilterList extends React.PureComponent {
  render() {
    return (
      <div className='g3-filter-list'>
        {this.props.sections.map((section, index) => (
          <FilterSection
            key={index}
            disabledTooltipMessage={this.props.disabledTooltipMessage}
            expanded={this.props.expandedStatus[index]}
            filterStatus={this.props.filterStatus[index]}
            hideZero={this.props.hideZero}
            isArrayField={section.isArrayField}
            isSearchFilter={section.isSearchFilter}
            lockedTooltipMessage={this.props.lockedTooltipMessage}
            onAfterDrag={(...args) => this.props.onAfterDrag(index, ...args)}
            onClear={() => this.props.onClearSection(index)}
            onSearchFilterLoadOptions={section.onSearchFilterLoadOptions}
            onSelect={(label) => this.props.onSelect(index, label)}
            onToggle={(isExpanded) =>
              this.props.onToggleSection(index, isExpanded)
            }
            onToggleCombineMode={(...args) =>
              this.props.onToggleCombineMode(index, ...args)
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
  filterStatus: [],
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
