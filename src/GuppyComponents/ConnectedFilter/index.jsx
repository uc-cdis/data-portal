/* eslint react/forbid-prop-types: 0 */
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import FilterGroup from '../../gen3-ui-component/components/filters/FilterGroup';
import FilterList from '../../gen3-ui-component/components/filters/FilterList';
import { queryGuppyForStatus } from '../Utils/queries';
import {
  getFilterSections,
  updateCountsInInitialTabsOptions,
  sortTabsOptions,
} from '../Utils/filters';
import '../typedef';

/**
 * @typedef {Object} ConnectedFilterProps
 * @property {object} [adminAppliedPreFilters]
 * @property {string} [className]
 * @property {FilterState} filter
 * @property {FilterConfig} filterConfig
 * @property {GuppyConfig} guppyConfig
 * @property {boolean} [hidden]
 * @property {boolean} [hideZero]
 * @property {FilterState} [initialAppliedFilters]
 * @property {SimpleAggsData} [initialTabsOptions]
 * @property {(anchorValue: string) => void} onAnchorValueChange
 * @property {FilterChangeHandler} onFilterChange
 * @property {(x: string[]) => void} [onPatientIdsChange]
 * @property {string[]} [patientIds]
 * @property {SimpleAggsData} tabsOptions
 * @property {number} [tierAccessLimit]
 */

/** @param {ConnectedFilterProps} props */
function ConnectedFilter({
  adminAppliedPreFilters = {},
  className = '',
  filter,
  filterConfig,
  guppyConfig,
  hidden = false,
  hideZero = false,
  initialAppliedFilters = {},
  initialTabsOptions = {},
  onAnchorValueChange,
  onFilterChange,
  onPatientIdsChange,
  patientIds,
  tabsOptions,
  tierAccessLimit,
}) {
  if (
    hidden ||
    filterConfig.tabs === undefined ||
    filterConfig.tabs.length === 0
  )
    return null;

  const processedTabsOptions = sortTabsOptions(
    updateCountsInInitialTabsOptions(initialTabsOptions, tabsOptions, filter)
  );
  if (Object.keys(processedTabsOptions).length === 0) {
    return null;
  }

  const arrayFields = useRef([]);
  useEffect(() => {
    queryGuppyForStatus().then((res) => {
      for (const { fields } of Object.values(res.indices))
        if (fields?.length > 0) arrayFields.current.concat(fields);
    });
  }, []);

  const filterTabs = filterConfig.tabs.map(
    ({ fields, searchFields }, index) => (
      <FilterList
        key={index}
        sections={getFilterSections(
          fields,
          searchFields,
          guppyConfig.fieldMapping,
          processedTabsOptions,
          initialTabsOptions,
          adminAppliedPreFilters,
          guppyConfig,
          arrayFields.current
        )}
        tierAccessLimit={tierAccessLimit}
        lockedTooltipMessage={`You may only view summary information for this project. You do not have ${guppyConfig.dataType}-level access.`}
        disabledTooltipMessage={`This resource is currently disabled because you are exploring restricted data. When exploring restricted data you are limited to exploring cohorts of ${tierAccessLimit} ${
          guppyConfig.nodeCountTitle?.toLowerCase() || guppyConfig.dataType
        } or more.`}
      />
    )
  );

  return (
    <FilterGroup
      className={className}
      tabs={filterTabs}
      filterConfig={filterConfig}
      onAnchorValueChange={onAnchorValueChange}
      onFilterChange={onFilterChange}
      onPatientIdsChange={onPatientIdsChange}
      patientIds={patientIds}
      hideZero={hideZero}
      initialAppliedFilters={initialAppliedFilters}
    />
  );
}

ConnectedFilter.propTypes = {
  adminAppliedPreFilters: PropTypes.object,
  className: PropTypes.string,
  filter: PropTypes.object.isRequired,
  filterConfig: PropTypes.shape({
    anchor: PropTypes.shape({
      field: PropTypes.string,
      options: PropTypes.arrayOf(PropTypes.string),
      tabs: PropTypes.arrayOf(PropTypes.string),
    }),
    tabs: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        fields: PropTypes.arrayOf(PropTypes.string),
        searchFields: PropTypes.arrayOf(PropTypes.string),
      })
    ),
  }).isRequired,
  guppyConfig: PropTypes.shape({
    dataType: PropTypes.string.isRequired,
    fieldMapping: PropTypes.arrayOf(
      PropTypes.shape({
        field: PropTypes.string,
        name: PropTypes.string,
      })
    ),
    nodeCountTitle: PropTypes.string,
  }).isRequired,
  hidden: PropTypes.bool,
  hideZero: PropTypes.bool,
  initialAppliedFilters: PropTypes.object,
  initialTabsOptions: PropTypes.object,
  onAnchorValueChange: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onPatientIdsChange: PropTypes.func,
  patientIds: PropTypes.arrayOf(PropTypes.string),
  tabsOptions: PropTypes.object.isRequired,
  tierAccessLimit: PropTypes.number,
};

export default ConnectedFilter;
