import cloneDeep from 'lodash.clonedeep';
import '../typedef';

/**
 * @param {FilterTabsOption[]} filterTabs
 * @param {boolean} expandedStatusControl
 */
export function getExpandedStatus(filterTabs, expandedStatusControl) {
  return filterTabs.map(({ fields }) =>
    fields.map(() => expandedStatusControl)
  );
}

/**
 * @param {Object} args
 * @param {AnchorConfig} args.anchorConfig
 * @param {FilterState} args.filterResults
 */
export function getFilterResultsByAnchor({ anchorConfig, filterResults }) {
  /** @type {{ [anchorLabel: string]: SimpleFilterState }} */
  const filterResultsByAnchor = { '': {} };

  if (anchorConfig !== undefined)
    for (const anchorValue of anchorConfig.options)
      filterResultsByAnchor[`${anchorConfig.field}:${anchorValue}`] = {};

  for (const [filterKey, filterValues] of Object.entries(filterResults))
    if ('filter' in filterValues) {
      filterResultsByAnchor[filterKey] = filterValues.filter;
    } else {
      filterResultsByAnchor[''][filterKey] = filterValues;
    }

  return filterResultsByAnchor;
}

/**
 * @param {string[]} fields
 * @param {SimpleFilterState} filterResults
 * @returns {FilterTabStatus}
 */
function getFilterTabStatus(fields, filterResults) {
  return fields.map((field) => {
    if (field in filterResults) {
      const filterValues = filterResults[field];
      if ('selectedValues' in filterValues) {
        const status = {};
        for (const selected of filterValues.selectedValues)
          status[selected] = true;
        return status;
      }
      if ('lowerBound' in filterValues) {
        return [filterValues.lowerBound, filterValues.upperBound];
      }
    }
    return {};
  });
}

/**
 * @param {Object} args
 * @param {AnchorConfig} args.anchorConfig
 * @param {FilterState} args.filterResults
 * @param {FilterTabsOption[]} args.filterTabs
 * @returns {FilterStatus}
 */
export function getFilterStatus({ anchorConfig, filterResults, filterTabs }) {
  const filterResultsByAnchor = getFilterResultsByAnchor({
    anchorConfig,
    filterResults,
  });
  return filterTabs.map(({ title, fields }) => {
    if (anchorConfig?.tabs.includes(title)) {
      /** @type {AnchoredFilterTabStatus} */
      const status = {};
      for (const [anchor, results] of Object.entries(filterResultsByAnchor))
        status[anchor] = getFilterTabStatus(fields, results);
      return status;
    }

    return getFilterTabStatus(fields, filterResultsByAnchor['']);
  });
}

/** @param {FilterState} filterResults */
export function removeEmptyFilter(filterResults) {
  /** @type {FilterState} */
  const newFilterResults = {};
  for (const field of Object.keys(filterResults)) {
    const filterValues = filterResults[field];
    if ('filter' in filterValues) {
      const newAnchoredFilterResults = removeEmptyFilter(filterValues.filter);
      if (Object.keys(newAnchoredFilterResults).length > 0)
        newFilterResults[field] = { filter: newAnchoredFilterResults };
    } else {
      const hasRangeFilter = 'lowerBound' in filterValues;
      const hasOptionFilter =
        'selectedValues' in filterValues &&
        filterValues.selectedValues.length > 0;
      // Filter settings are prefaced with two underscores, e.g., __combineMode
      // A given config setting is still informative to Guppy even if the setting becomes empty
      const hasConfigSetting = Object.keys(filterValues).some((x) =>
        x.startsWith('__')
      );
      if (hasRangeFilter || hasOptionFilter || hasConfigSetting) {
        newFilterResults[field] = filterValues;
      }
    }
  }

  return newFilterResults;
}

/**
 * @param {Object} args
 * @param {FilterStatus} args.filterStatus
 * @param {FilterState} args.filterResults
 * @param {FilterTabsOption[]} args.filterTabs
 * @param {number} args.tabIndex
 * @param {string} args.anchorLabel
 * @param {number} args.sectionIndex
 */
export function clearFilterSection({
  filterStatus,
  filterResults,
  filterTabs,
  tabIndex,
  anchorLabel,
  sectionIndex,
}) {
  // update filter status
  const newFilterStatus = cloneDeep(filterStatus);
  const newFilterTabStatus = newFilterStatus[tabIndex];
  if (Array.isArray(newFilterTabStatus)) newFilterTabStatus[sectionIndex] = {};
  else newFilterTabStatus[anchorLabel][sectionIndex] = {};

  // update filter results; clear the results for this filter
  let newFilterResults = cloneDeep(filterResults);
  const fieldName = filterTabs[tabIndex].fields[sectionIndex];
  if (anchorLabel === undefined || anchorLabel === '') {
    newFilterResults[fieldName] = {};
  } else {
    newFilterResults[anchorLabel].filter[fieldName] = {};
  }
  newFilterResults = removeEmptyFilter(newFilterResults);

  // update component state
  return {
    filterStatus: newFilterStatus,
    filterResults: newFilterResults,
  };
}

/** @param {FilterTabStatus | AnchoredFilterTabStatus} filterTabStatus */
export function tabHasActiveFilters(filterTabStatus) {
  if (Array.isArray(filterTabStatus)) {
    for (const filterSectionStatus of filterTabStatus) {
      const hasActiveFilters = Object.values(filterSectionStatus).some(
        (status) => status !== undefined && status !== false
      );
      if (hasActiveFilters) return true;
    }
    return false;
  }
  return Object.values(filterTabStatus).some(tabHasActiveFilters);
}

/**
 * @param {Object} args
 * @param {FilterStatus} args.filterStatus
 * @param {FilterState} args.filterResults
 * @param {FilterTabsOption[]} args.filterTabs
 * @param {number} args.tabIndex
 * @param {string} args.anchorLabel
 * @param {number} args.sectionIndex
 * @param {string} args.combineModeFieldName
 * @param {string} args.combineModeValue
 */
export function updateCombineMode({
  filterStatus,
  filterResults,
  filterTabs,
  tabIndex,
  anchorLabel,
  sectionIndex,
  combineModeFieldName,
  combineModeValue,
}) {
  // update filter status
  const newFilterStatus = cloneDeep(filterStatus);
  const newFilterTabStatus = newFilterStatus[tabIndex];
  if (Array.isArray(newFilterTabStatus))
    newFilterTabStatus[sectionIndex][combineModeFieldName] = combineModeValue;
  else
    newFilterTabStatus[anchorLabel][sectionIndex][
      combineModeFieldName
    ] = combineModeValue;

  // update filter results
  let newFilterResults = cloneDeep(filterResults);
  const fieldName = filterTabs[tabIndex].fields[sectionIndex];
  if (anchorLabel === undefined || anchorLabel === '') {
    if (newFilterResults[fieldName] === undefined) {
      newFilterResults[fieldName] = {
        [combineModeFieldName]: combineModeValue,
      };
    } else {
      newFilterResults[fieldName][combineModeFieldName] = combineModeValue;
    }
  } else {
    if (!(anchorLabel in newFilterResults))
      newFilterResults[anchorLabel] = { filter: {} };
    if (!('filter' in newFilterResults[anchorLabel]))
      newFilterResults[anchorLabel].filter = {};
    const newAnchoredFilterResults = newFilterResults[anchorLabel].filter;
    if (newAnchoredFilterResults[fieldName] === undefined) {
      newAnchoredFilterResults[fieldName] = {
        [combineModeFieldName]: combineModeValue,
      };
    } else {
      newAnchoredFilterResults[fieldName][
        combineModeFieldName
      ] = combineModeValue;
    }
  }

  newFilterResults = removeEmptyFilter(newFilterResults);

  // update component state
  return {
    filterStatus: newFilterStatus,
    filterResults: newFilterResults,
  };
}

/**
 * @param {Object} args
 * @param {FilterStatus} args.filterStatus
 * @param {FilterState} args.filterResults
 * @param {FilterTabsOption[]} args.filterTabs
 * @param {number} args.tabIndex
 * @param {string} args.anchorLabel
 * @param {number} args.sectionIndex
 * @param {number} args.lowerBound
 * @param {number} args.upperBound
 * @param {number} args.minValue
 * @param {number} args.maxValue
 * @param {number} args.rangeStep
 */
export function updateRangeValue({
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
}) {
  // update filter status
  const newFilterStatus = cloneDeep(filterStatus);
  const newFilterTabStatus = newFilterStatus[tabIndex];
  if (Array.isArray(newFilterTabStatus))
    newFilterTabStatus[sectionIndex] = [lowerBound, upperBound];
  else newFilterTabStatus[anchorLabel][sectionIndex] = [lowerBound, upperBound];

  // update filter results
  let newFilterResults = cloneDeep(filterResults);
  const fieldName = filterTabs[tabIndex].fields[sectionIndex];
  if (anchorLabel === undefined || anchorLabel === '') {
    newFilterResults[fieldName] = { lowerBound, upperBound };
    // if lowerbound and upperbound values equal min and max,
    // remove this range from filter
    if (
      Math.abs(lowerBound - minValue) < rangeStep &&
      Math.abs(upperBound - maxValue) < rangeStep
    ) {
      delete newFilterResults[fieldName];
    }
  } else {
    if (!(anchorLabel in newFilterResults))
      newFilterResults[anchorLabel] = { filter: {} };
    if (!('filter' in newFilterResults[anchorLabel]))
      newFilterResults[anchorLabel].filter = {};
    const newAnchoredFilterResults = newFilterResults[anchorLabel].filter;
    newAnchoredFilterResults[fieldName] = { lowerBound, upperBound };
    // if lowerbound and upperbound values equal min and max,
    // remove this range from filter
    if (
      Math.abs(lowerBound - minValue) < rangeStep &&
      Math.abs(upperBound - maxValue) < rangeStep
    ) {
      delete newAnchoredFilterResults[fieldName];
    }
  }
  newFilterResults = removeEmptyFilter(newFilterResults);

  return {
    filterStatus: newFilterStatus,
    filterResults: newFilterResults,
  };
}

/**
 * @param {Object} args
 * @param {FilterStatus} args.filterStatus
 * @param {FilterState} args.filterResults
 * @param {FilterTabsOption[]} args.filterTabs
 * @param {number} args.tabIndex
 * @param {string} args.anchorLabel
 * @param {number} args.sectionIndex
 * @param {string} args.selectedValue
 */
export function updateSelectedValue({
  filterStatus,
  filterResults,
  filterTabs,
  tabIndex,
  anchorLabel,
  sectionIndex,
  selectedValue,
}) {
  // update filter status
  const newFilterStatus = cloneDeep(filterStatus);
  const newFilterTabStatus = newFilterStatus[tabIndex];
  let wasSelected;
  let isSelected;
  if (Array.isArray(newFilterTabStatus)) {
    wasSelected = newFilterTabStatus[sectionIndex][selectedValue];
    isSelected = wasSelected === undefined ? true : !wasSelected;
    newFilterTabStatus[sectionIndex][selectedValue] = isSelected;
  } else {
    wasSelected = newFilterTabStatus[anchorLabel][sectionIndex][selectedValue];
    isSelected = wasSelected === undefined ? true : !wasSelected;
    newFilterTabStatus[anchorLabel][sectionIndex][selectedValue] = isSelected;
  }

  // update filter results
  let newFilterResults = cloneDeep(filterResults);
  const fieldName = filterTabs[tabIndex].fields[sectionIndex];
  if (anchorLabel === undefined || anchorLabel === '') {
    if (newFilterResults[fieldName] === undefined)
      newFilterResults[fieldName] = { selectedValues: [selectedValue] };
    else if (newFilterResults[fieldName].selectedValues === undefined)
      newFilterResults[fieldName].selectedValues = [selectedValue];
    else {
      const { selectedValues } = newFilterResults[fieldName];
      const selectedValueIndex = selectedValues.indexOf(selectedValue);
      if (selectedValueIndex >= 0 && !isSelected)
        selectedValues.splice(selectedValueIndex, 1);
      else if (selectedValueIndex < 0 && isSelected)
        selectedValues.push(selectedValue);
    }
  } else {
    if (!(anchorLabel in newFilterResults))
      newFilterResults[anchorLabel] = { filter: {} };
    if (!('filter' in newFilterResults[anchorLabel]))
      newFilterResults[anchorLabel].filter = {};
    const newAnchoredFilterResults = newFilterResults[anchorLabel].filter;
    if (newAnchoredFilterResults[fieldName] === undefined)
      newAnchoredFilterResults[fieldName] = { selectedValues: [selectedValue] };
    else if (newAnchoredFilterResults[fieldName].selectedValues === undefined)
      newAnchoredFilterResults[fieldName].selectedValues = [selectedValue];
    else {
      const { selectedValues } = newAnchoredFilterResults[fieldName];
      const selectedValueIndex = selectedValues.indexOf(selectedValue);
      if (selectedValueIndex >= 0 && !isSelected)
        selectedValues.splice(selectedValueIndex, 1);
      else if (selectedValueIndex < 0 && isSelected)
        selectedValues.push(selectedValue);
    }
  }
  newFilterResults = removeEmptyFilter(newFilterResults);

  // update component state
  return {
    filterStatus: newFilterStatus,
    filterResults: newFilterResults,
  };
}

/** @param {FilterSectionStatus} filterSectionStatus */
function checkIfFilterSectionActive(filterSectionStatus) {
  return Array.isArray(filterSectionStatus)
    ? filterSectionStatus.length > 0
    : Object.values(filterSectionStatus).some(Boolean);
}

/** @param {FilterStatus} filterStatus */
export function getSelectedAnchors(filterStatus) {
  /** @type {string[][]} */
  const selectedAnchors = [];
  for (const tabStatus of filterStatus) {
    /** @type {string[]} */
    const selectedAnchorsForTab = [];
    if (!Array.isArray(tabStatus))
      for (const [anchorLabel, anchoredTabStatus] of Object.entries(tabStatus))
        if (
          anchorLabel !== '' &&
          anchoredTabStatus.some(checkIfFilterSectionActive)
        )
          selectedAnchorsForTab.push(anchorLabel.split(':')[1]);

    selectedAnchors.push(selectedAnchorsForTab);
  }
  return selectedAnchors;
}
