import React from 'react';
import PropTypes from 'prop-types';
import FilterSection from '../FilterSection';
import './FilterList.css';
import '../typedef';

/**
 * @typedef {Object} FilterListProps
 * @property {string} disabledTooltipMessage
 * @property {boolean[]} [expandedStatus]
 * @property {(OptionFilterStatus | RangeFilterStatus)[]} [filterStatus]
 * @property {boolean} [hideZero]
 * @property {string} lockedTooltipMessage
 * @property {(index: number, lowerBound: number, upperBound: number, min: number, max: number, rangeStep: number) => void} [onAfterDrag]
 * @property {(index: number) => void} [onClearSection]
 * @property {(index: number, label: string) => void} [onSelect]
 * @property {(index: number, fieldName: string, value: string) => void} [onToggleCombineMode]
 * @property {(index: number, isExpanded: boolean) => void} [onToggleSection]
 * @property {FilterSectionConfig[]} sections
 * @property {number} tierAccessLimit
 */

/** @param {FilterListProps} props */
function FilterList({
  disabledTooltipMessage = '',
  expandedStatus = [],
  filterStatus = [],
  hideZero = true,
  lockedTooltipMessage = '',
  onAfterDrag = () => {},
  onClearSection = () => {},
  onSelect = () => {},
  onToggleCombineMode = () => {},
  onToggleSection = () => {},
  sections,
  tierAccessLimit,
}) {
  return (
    <div className='g3-filter-list'>
      {sections.map((section, index) => (
        <FilterSection
          key={index}
          disabledTooltipMessage={disabledTooltipMessage}
          expanded={expandedStatus[index]}
          filterStatus={filterStatus[index]}
          hideZero={hideZero}
          isArrayField={section.isArrayField}
          isSearchFilter={section.isSearchFilter}
          lockedTooltipMessage={lockedTooltipMessage}
          onAfterDrag={(...args) => onAfterDrag(index, ...args)}
          onClear={() => onClearSection(index)}
          onSearchFilterLoadOptions={section.onSearchFilterLoadOptions}
          onSelect={(label) => onSelect(index, label)}
          onToggle={(isExpanded) => onToggleSection(index, isExpanded)}
          onToggleCombineMode={(...args) => onToggleCombineMode(index, ...args)}
          options={section.options}
          tierAccessLimit={tierAccessLimit}
          title={section.title}
          tooltip={section.tooltip}
        />
      ))}
    </div>
  );
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

export default FilterList;
