import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash.clonedeep';
import PatientIdFilter from '../PatientIdFilter';
import {
  getExpandedStatus,
  getFilterStatus,
  clearFilterSection,
  tabHasActiveFilters,
  toggleCombineOption,
  updateRangeValue,
  updateSelectedValue,
} from './utils';
import './FilterGroup.css';
import './typedef';

/**
 * @typedef {Object} FilterGroupProps
 * @property {JSX.Element[]} tabs
 * @property {FilterConfig} filterConfig
 * @property {(filter: FilterState) => void} onFilterChange
 * @property {(patientIds: string[]) => void} onPatientIdsChange
 * @property {boolean} hideZero
 * @property {string} className
 * @property {FilterState} initialAppliedFilters
 * @property {string[]} patientIds
 */

/** @param {FilterGroupProps} props */
function FilterGroup({
  tabs,
  filterConfig,
  onFilterChange = () => {},
  onPatientIdsChange,
  hideZero = true,
  className = '',
  initialAppliedFilters = {},
  patientIds,
}) {
  const currentFilterListRef = useRef();

  const filterTabs = filterConfig.tabs;
  const [tabIndex, setTabIndex] = useState(0);

  const showPatientIdsFilter = patientIds !== undefined;

  const [expandedStatusControl, setExpandedStatusControl] = useState(false);
  const expandedStatusText = expandedStatusControl
    ? 'Collapse all'
    : 'Open all';
  const [expandedStatus, setExpandedStatus] = useState(
    getExpandedStatus(filterTabs, false)
  );

  const [filterResults, setFilterResults] = useState(initialAppliedFilters);
  const [filterStatus, setFilterStatus] = useState(
    getFilterStatus(initialAppliedFilters, filterTabs)
  );
  useEffect(() => {
    const newFilterStatus = getFilterStatus(initialAppliedFilters, filterTabs);
    const newFilterResults = initialAppliedFilters;

    setFilterStatus(newFilterStatus);
    setFilterResults(newFilterResults);
    onFilterChange(newFilterResults);
  }, [initialAppliedFilters]);

  /**
   * @param {number} sectionIndex
   * @param {boolean[][]} newSectionExpandedStatus
   */
  function handleToggle(sectionIndex, newSectionExpandedStatus) {
    const newExpandedStatus = cloneDeep(expandedStatus);
    newExpandedStatus[tabIndex][sectionIndex] = newSectionExpandedStatus;
    setExpandedStatus(newExpandedStatus);
  }

  /** @param {number} sectionIndex */
  function handleSectionClear(sectionIndex) {
    const updated = clearFilterSection({
      filterStatus,
      filterResults,
      filterTabs,
      tabIndex,
      sectionIndex,
    });
    setFilterResults(updated.filterResults);
    setFilterStatus(updated.filterStatus);
    onFilterChange(updated.filterResults);
  }

  /**
   * @param {number} sectionIndex
   * @param {string} combineModeFieldName
   * @param {boolean} combineModeValue
   */
  function handleCombineOptionToggle(
    sectionIndex,
    combineModeFieldName,
    combineModeValue
  ) {
    const updated = toggleCombineOption({
      filterStatus,
      filterResults,
      filterTabs,
      tabIndex,
      sectionIndex,
      combineModeFieldName,
      combineModeValue,
    });
    setFilterStatus(updated.filterStatus);
    setFilterResults(updated.filterResults);

    // If no other filter is applied, the combineMode is not yet useful to Guppy
    const field = filterTabs[tabIndex].fields[sectionIndex];
    const filterValues = filterResults[field];
    if (
      'selectedValues' in filterValues &&
      filterValues.selectedValues.length > 0
    )
      onFilterChange(updated.filterResults);
  }

  /**
   * @param {number} sectionIndex
   * @param {string} singleFilterLabel
   */
  function handleSelect(sectionIndex, singleFilterLabel) {
    const updated = updateSelectedValue({
      filterStatus,
      filterResults,
      filterTabs,
      tabIndex,
      sectionIndex,
      singleFilterLabel,
    });
    setFilterStatus(updated.filterStatus);
    setFilterResults(updated.filterResults);
    onFilterChange(updated.filterResults);
  }

  /**
   * @param {number} sectionIndex
   * @param {number} lowerBound
   * @param {number} upperBound
   * @param {number} minValue
   * @param {number} maxValue
   * @param {number} rangeStep
   */
  function handleDrag(
    sectionIndex,
    lowerBound,
    upperBound,
    minValue,
    maxValue,
    rangeStep = 1
  ) {
    const updated = updateRangeValue({
      filterStatus,
      filterResults,
      filterTabs,
      tabIndex,
      sectionIndex,
      lowerBound,
      upperBound,
      minValue,
      maxValue,
      rangeStep,
    });
    setFilterStatus(updated.filterStatus);
    setFilterResults(updated.filterResults);
    onFilterChange(updated.filterResults);
  }

  function toggleFilters() {
    const newExpandedStatusControl = !expandedStatusControl;
    currentFilterListRef.current.toggleFilters(newExpandedStatusControl);
    setExpandedStatusControl(newExpandedStatusControl);
    setExpandedStatus(getExpandedStatus(filterTabs, expandedStatusControl));
  }

  return (
    <div className={`g3-filter-group ${className}`}>
      <div className='g3-filter-group__tabs'>
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={'g3-filter-group__tab'.concat(
              tabIndex === index ? ' g3-filter-group__tab--selected' : ''
            )}
            onClick={() => setTabIndex(index)}
            onKeyPress={(e) => {
              if (e.charCode === 13 || e.charCode === 32) {
                e.preventDefault();
                setTabIndex(index);
              }
            }}
            role='button'
            tabIndex={0}
            aria-label={`Filter group tab: ${filterTabs[index].title}`}
          >
            <p
              className={`g3-filter-group__tab-title ${
                tabHasActiveFilters(filterStatus[index])
                  ? 'g3-filter-group__tab-title--has-active-filters'
                  : ''
              }`}
            >
              {filterTabs[index].title}
            </p>
          </div>
        ))}
      </div>
      {showPatientIdsFilter && (
        <PatientIdFilter
          onPatientIdsChange={onPatientIdsChange}
          patientIds={patientIds}
        />
      )}
      <div className='g3-filter-group__collapse'>
        <span
          className='g3-link g3-filter-group__collapse-link'
          onClick={toggleFilters}
          onKeyPress={(e) => {
            if (e.charCode === 13 || e.charCode === 32) {
              e.preventDefault();
              toggleFilters();
            }
          }}
          role='button'
          tabIndex={0}
          aria-label={expandedStatusText}
        >
          {expandedStatusText}
        </span>
      </div>
      <div className='g3-filter-group__filter-area'>
        {React.cloneElement(tabs[tabIndex], {
          onToggle: handleToggle,
          onClear: handleSectionClear,
          expandedStatus: expandedStatus[tabIndex],
          filterStatus: filterStatus[tabIndex],
          onSelect: handleSelect,
          onCombineOptionToggle: handleCombineOptionToggle,
          onAfterDrag: handleDrag,
          hideZero,
          ref: currentFilterListRef,
        })}
      </div>
    </div>
  );
}

FilterGroup.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.object).isRequired,
  filterConfig: PropTypes.shape({
    tabs: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        fields: PropTypes.arrayOf(PropTypes.string),
      })
    ),
  }).isRequired,
  onFilterChange: PropTypes.func,
  onPatientIdsChange: PropTypes.func,
  hideZero: PropTypes.bool,
  className: PropTypes.string,
  initialAppliedFilters: PropTypes.object,
  patientIds: PropTypes.arrayOf(PropTypes.string),
};

export default FilterGroup;
