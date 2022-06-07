import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash.clonedeep';
import Select from 'react-select';
import { overrideSelectTheme } from '../../../../utils';
import AnchorFilter from '../AnchorFilter';
import FilterSection from '../FilterSection';
import PatientIdFilter from '../PatientIdFilter';
import {
  clearFilterSection,
  getExpandedStatus,
  getFilterStatus,
  getSelectedAnchors,
  tabHasActiveFilters,
  updateCombineMode,
  updateRangeValue,
  updateSelectedValue,
} from './utils';
import './FilterGroup.css';

/** @param {string} label */
function findFilterElement(label) {
  const selector = 'div.g3-filter-section__title-container';
  /** @type {NodeListOf<HTMLDivElement>} */
  const sectionTitleElements = document.querySelectorAll(selector);

  for (const el of sectionTitleElements)
    if (label === el.attributes['aria-label'].value.split(': ')[1]) {
      el.focus();
      break;
    }
}

/** @typedef {import('../types').FilterChangeHandler} FilterChangeHandler */
/** @typedef {import('../types').FilterConfig} FilterConfig */
/** @typedef {import('../types').FilterState} FilterState */
/** @typedef {import('../types').FilterSectionConfig} FilterSectionConfig */

/**
 * @typedef {Object} FilterGroupProps
 * @property {string} [anchorValue]
 * @property {string} [className]
 * @property {string} [disabledTooltipMessage]
 * @property {FilterState} [explorerFilter]
 * @property {FilterConfig} filterConfig
 * @property {boolean} [hideZero]
 * @property {string} [lockedTooltipMessage]
 * @property {(anchorValue: string) => void} [onAnchorValueChange]
 * @property {FilterChangeHandler} [onFilterChange]
 * @property {(patientIds: string[]) => void} [onPatientIdsChange]
 * @property {string[]} [patientIds]
 * @property {FilterSectionConfig[][]} tabs
 */

/** @type {FilterState} */
const defaultExplorerFilter = {};

/** @param {FilterGroupProps} props */
function FilterGroup({
  anchorValue = '',
  className = '',
  disabledTooltipMessage,
  filterConfig,
  hideZero = true,
  explorerFilter = defaultExplorerFilter,
  lockedTooltipMessage,
  onAnchorValueChange = () => {},
  onFilterChange = () => {},
  onPatientIdsChange,
  patientIds,
  tabs,
}) {
  const filterTabs = filterConfig.tabs.map(
    ({ title, fields, searchFields }) => ({
      title,
      // If there are any search fields, insert them at the top of each tab's fields.
      fields: searchFields ? searchFields.concat(fields) : fields,
    })
  );
  const [tabIndex, setTabIndex] = useState(0);
  const tabTitle = filterTabs[tabIndex].title;
  const showAnchorFilter =
    filterConfig.anchor !== undefined &&
    filterConfig.anchor.tabs.includes(tabTitle);
  const showPatientIdsFilter =
    patientIds !== undefined && tabTitle === 'Subject';

  const anchorLabel =
    filterConfig.anchor !== undefined && anchorValue !== '' && showAnchorFilter
      ? `${filterConfig.anchor.field}:${anchorValue}`
      : '';

  const [expandedStatusControl, setExpandedStatusControl] = useState(false);
  const expandedStatusText = expandedStatusControl
    ? 'Collapse all'
    : 'Open all';
  const [expandedStatus, setExpandedStatus] = useState(
    getExpandedStatus(filterTabs, false)
  );

  const [filterResults, setFilterResults] = useState(explorerFilter);
  const [filterStatus, setFilterStatus] = useState(
    getFilterStatus({
      anchorConfig: filterConfig.anchor,
      filterResults: explorerFilter,
      filterTabs,
    })
  );
  const isInitialRenderRef = useRef(true);
  useEffect(() => {
    if (isInitialRenderRef.current) {
      isInitialRenderRef.current = false;
      return;
    }

    const newFilterStatus = getFilterStatus({
      anchorConfig: filterConfig.anchor,
      filterResults: explorerFilter,
      filterTabs,
    });
    const newFilterResults = explorerFilter;

    setFilterStatus(newFilterStatus);
    setFilterResults(newFilterResults);
  }, [explorerFilter]);

  const filterTabStatus = showAnchorFilter
    ? filterStatus[tabIndex][anchorLabel]
    : filterStatus[tabIndex];

  const selectedAnchors = getSelectedAnchors(filterStatus);

  /**
   * @param {number} sectionIndex
   * @param {boolean} isExpanded
   */
  function handleToggleSection(sectionIndex, isExpanded) {
    const newExpandedStatus = cloneDeep(expandedStatus);
    newExpandedStatus[tabIndex][sectionIndex] = isExpanded;
    setExpandedStatus(newExpandedStatus);
  }

  /** @param {number} sectionIndex */
  function handleClearSection(sectionIndex) {
    const updated = clearFilterSection({
      filterStatus,
      filterResults,
      filterTabs,
      tabIndex,
      anchorLabel,
      sectionIndex,
    });
    setFilterResults(updated.filterResults);
    setFilterStatus(updated.filterStatus);
    onFilterChange(updated.filterResults);
  }

  /**
   * @param {number} sectionIndex
   * @param {string} combineModeFieldName
   * @param {string} combineModeValue
   */
  function handleToggleCombineMode(
    sectionIndex,
    combineModeFieldName,
    combineModeValue
  ) {
    const updated = updateCombineMode({
      filterStatus,
      filterResults,
      filterTabs,
      tabIndex,
      anchorLabel,
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
   * @param {string} selectedValue
   */
  function handleSelect(sectionIndex, selectedValue) {
    const updated = updateSelectedValue({
      filterStatus,
      filterResults,
      filterTabs,
      tabIndex,
      anchorLabel,
      sectionIndex,
      selectedValue,
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
      anchorLabel,
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

  function toggleSections() {
    const newExpandedStatusControl = !expandedStatusControl;
    setExpandedStatusControl(newExpandedStatusControl);
    setExpandedStatus(getExpandedStatus(filterTabs, newExpandedStatusControl));
  }

  const filterFinderOptions = filterTabs.map((tab, index) => ({
    label: tab.title,
    options: tabs[index].map((section) => ({
      label: section.title,
      value: { index, title: section.title },
    })),
  }));
  const filterToFind = useRef('');
  useEffect(() => {
    if (filterToFind.current !== '') {
      findFilterElement(filterToFind.current);
      filterToFind.current = '';
    }
  }, [tabIndex]);
  /** @param {{ value: { index: number; title: string }}} option */
  function handleFindFilter({ value }) {
    if (tabIndex !== value.index) {
      filterToFind.current = value.title;
      setTabIndex(value.index);
    } else {
      findFilterElement(value.title);
    }
  }

  return (
    <div className={`g3-filter-group ${className}`}>
      <Select
        className='g3-filter-group__filter-finder'
        placeholder='Find filter to use'
        onChange={handleFindFilter}
        options={filterFinderOptions}
        theme={overrideSelectTheme}
        value={null}
      />
      <div className='g3-filter-group__tabs'>
        {tabs.map((_, index) => (
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
      <div className='g3-filter-group__collapse'>
        <span
          className='g3-link g3-filter-group__collapse-link'
          onClick={toggleSections}
          onKeyPress={(e) => {
            if (e.charCode === 13 || e.charCode === 32) {
              e.preventDefault();
              toggleSections();
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
        {showAnchorFilter && (
          <AnchorFilter
            anchorField={filterConfig.anchor.field}
            anchorValue={anchorValue}
            onChange={onAnchorValueChange}
            options={filterConfig.anchor.options}
            optionsInUse={selectedAnchors[tabIndex]}
            tooltip={filterConfig.anchor.tooltip}
          />
        )}
        {showPatientIdsFilter && (
          <PatientIdFilter
            onPatientIdsChange={onPatientIdsChange}
            patientIds={patientIds}
          />
        )}
        {tabs[tabIndex].map((section, index) => (
          <FilterSection
            key={section.title}
            disabledTooltipMessage={disabledTooltipMessage}
            expanded={expandedStatus[tabIndex][index]}
            filterStatus={filterTabStatus[index]}
            hideZero={hideZero}
            isArrayField={section.isArrayField}
            isSearchFilter={section.isSearchFilter}
            lockedTooltipMessage={lockedTooltipMessage}
            onAfterDrag={(...args) => handleDrag(index, ...args)}
            onClear={() => handleClearSection(index)}
            onSearchFilterLoadOptions={section.onSearchFilterLoadOptions}
            onSelect={(label) => handleSelect(index, label)}
            onToggle={(isExpanded) => handleToggleSection(index, isExpanded)}
            onToggleCombineMode={(...args) =>
              handleToggleCombineMode(index, ...args)
            }
            options={section.options}
            title={section.title}
            tooltip={section.tooltip}
          />
        ))}
      </div>
    </div>
  );
}

FilterGroup.propTypes = {
  anchorValue: PropTypes.string,
  className: PropTypes.string,
  disabledTooltipMessage: PropTypes.string,
  explorerFilter: PropTypes.object,
  filterConfig: PropTypes.shape({
    anchor: PropTypes.shape({
      field: PropTypes.string,
      options: PropTypes.arrayOf(PropTypes.string),
      tabs: PropTypes.arrayOf(PropTypes.string),
      tooltip: PropTypes.string,
    }),
    tabs: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        fields: PropTypes.arrayOf(PropTypes.string),
        searchFields: PropTypes.arrayOf(PropTypes.string),
      })
    ),
  }).isRequired,
  hideZero: PropTypes.bool,
  lockedTooltipMessage: PropTypes.string,
  onAnchorValueChange: PropTypes.func,
  onFilterChange: PropTypes.func,
  onPatientIdsChange: PropTypes.func,
  patientIds: PropTypes.arrayOf(PropTypes.string),
  tabs: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.object)).isRequired,
};

export default FilterGroup;
