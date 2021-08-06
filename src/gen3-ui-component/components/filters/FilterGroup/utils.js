import cloneDeep from 'lodash.clonedeep';
import './typedef';

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
 * @param {FilterState} filterResults
 * @param {FilterTabsOption[]} filterTabs
 * @returns {FilterSectionStatus[][]}
 */
export function getFilterStatus(filterResults, filterTabs) {
  return filterTabs.map(({ fields }) =>
    fields.map((field) => {
      if (Object.keys(filterResults).includes(field)) {
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
    })
  );
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
 * @param {FilterSectionStatus[][]} args.filterStatus
 * @param {FilterState} args.filterResults
 * @param {FilterTabsOption[]} args.filterTabs
 * @param {number} args.tabIndex
 * @param {number} args.sectionIndex
 */
export function clearFilterSection({
  filterStatus,
  filterResults,
  filterTabs,
  tabIndex,
  sectionIndex,
}) {
  // update filter status
  const newFilterStatus = cloneDeep(filterStatus);
  newFilterStatus[tabIndex][sectionIndex] = {};

  // update filter results; clear the results for this filter
  let newFilterResults = cloneDeep(filterResults);
  const field = filterTabs[tabIndex].fields[sectionIndex];
  newFilterResults[field] = {};
  newFilterResults = removeEmptyFilter(newFilterResults);

  // update component state
  return {
    filterStatus: newFilterStatus,
    filterResults: newFilterResults,
  };
}

/** @param {FilterSectionStatus[]} filterTabStatus */
export function tabHasActiveFilters(filterTabStatus) {
  for (const filterSectionStatus of filterTabStatus) {
    const hasActiveFilters = Object.values(filterSectionStatus).some(
      (status) => status !== undefined && status !== false
    );
    if (hasActiveFilters) return true;
  }
  return false;
}

/**
 * @param {Object} args
 * @param {FilterSectionStatus[][]} args.filterStatus
 * @param {FilterState} args.filterResults
 * @param {FilterTabsOption[]} args.filterTabs
 * @param {number} args.tabIndex
 * @param {number} args.sectionIndex
 * @param {string} args.combineModeFieldName
 * @param {string} args.combineModeValue
 */
export function toggleCombineOption({
  filterStatus,
  filterResults,
  filterTabs,
  tabIndex,
  sectionIndex,
  combineModeFieldName,
  combineModeValue,
}) {
  // update filter status
  const newFilterStatus = cloneDeep(filterStatus);
  newFilterStatus[tabIndex][sectionIndex][
    combineModeFieldName
  ] = combineModeValue;

  // update filter results
  let newFilterResults = cloneDeep(filterResults);
  const field = filterTabs[tabIndex].fields[sectionIndex];
  if (newFilterResults[field] === undefined) {
    newFilterResults[field] = { [combineModeFieldName]: combineModeValue };
  } else {
    newFilterResults[field][combineModeFieldName] = combineModeValue;
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
 * @param {FilterSectionStatus[][]} args.filterStatus
 * @param {FilterState} args.filterResults
 * @param {FilterTabsOption[]} args.filterTabs
 * @param {number} args.tabIndex
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
  sectionIndex,
  lowerBound,
  upperBound,
  minValue,
  maxValue,
  rangeStep,
}) {
  // update filter status
  const newFilterStatus = cloneDeep(filterStatus);
  newFilterStatus[tabIndex][sectionIndex] = [lowerBound, upperBound];

  // update filter results
  let newFilterResults = cloneDeep(filterResults);
  const field = filterTabs[tabIndex].fields[sectionIndex];
  newFilterResults[field] = { lowerBound, upperBound };
  // if lowerbound and upperbound values equal min and max,
  // remove this range from filter
  if (
    Math.abs(lowerBound - minValue) < rangeStep &&
    Math.abs(upperBound - maxValue) < rangeStep
  ) {
    delete newFilterResults[field];
  }
  newFilterResults = removeEmptyFilter(newFilterResults);

  return {
    filterStatus: newFilterStatus,
    filterResults: newFilterResults,
  };
}

/**
 * @param {Object} args
 * @param {FilterSectionStatus[][]} args.filterStatus
 * @param {FilterState} args.filterResults
 * @param {FilterTabsOption[]} args.filterTabs
 * @param {number} args.tabIndex
 * @param {number} args.sectionIndex
 * @param {string} args.selectedValue
 */
export function updateSelectedValue({
  filterStatus,
  filterResults,
  filterTabs,
  tabIndex,
  sectionIndex,
  selectedValue,
}) {
  // update filter status
  const newFilterStatus = cloneDeep(filterStatus);
  const wasSelected = newFilterStatus[tabIndex][sectionIndex][selectedValue];
  const isSelected = wasSelected === undefined ? true : !wasSelected;
  newFilterStatus[tabIndex][sectionIndex][selectedValue] = isSelected;

  // update filter results
  let newFilterResults = cloneDeep(filterResults);
  const field = filterTabs[tabIndex].fields[sectionIndex];
  if (newFilterResults[field] === undefined) {
    newFilterResults[field] = { selectedValues: [selectedValue] };
  } else if (newFilterResults[field].selectedValues === undefined) {
    newFilterResults[field].selectedValues = [selectedValue];
  } else {
    const { selectedValues } = newFilterResults[field];
    const selectedValueIndex = selectedValues.indexOf(selectedValue);
    if (selectedValueIndex >= 0 && !isSelected)
      selectedValues.splice(selectedValueIndex, 1);
    else if (selectedValueIndex < 0 && isSelected)
      selectedValues.push(selectedValue);
  }
  newFilterResults = removeEmptyFilter(newFilterResults);

  // update component state
  return {
    filterStatus: newFilterStatus,
    filterResults: newFilterResults,
  };
}
