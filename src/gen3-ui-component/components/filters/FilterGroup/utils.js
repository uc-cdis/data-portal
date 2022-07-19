import cloneDeep from 'lodash.clonedeep';
import { FILTER_TYPE } from '../../../../GuppyComponents/Utils/const';

export { FILTER_TYPE } from '../../../../GuppyComponents/Utils/const';

/** @typedef {import('../types').AnchorConfig} AnchorConfig */
/** @typedef {import('../types').AnchoredFilterState} AnchoredFilterState */
/** @typedef {import('../types').AnchoredFilterTabStatus} AnchoredFilterTabStatus */
/** @typedef {import('../types').FilterSectionStatus} FilterSectionStatus */
/** @typedef {import('../types').FilterState} FilterState */
/** @typedef {import('../types').FilterStatus} FilterStatus */
/** @typedef {import('../types').FilterTabsOption} FilterTabsOption */
/** @typedef {import('../types').FilterTabStatus} FilterTabStatus */
/** @typedef {import('../types').SimpleFilterState} SimpleFilterState */
/** @typedef {import('../types').OptionFilter} OptionFilter */
/** @typedef {import('../types').RangeFilter} RangeFilter */
/** @typedef {OptionFilter | RangeFilter} BasicFilter */

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
 * @param {AnchorConfig} [args.anchorConfig]
 * @param {FilterState} args.filterResults
 */
export function getFilterResultsByAnchor({ anchorConfig, filterResults }) {
  /** @type {{ [anchorLabel: string]: SimpleFilterState }} */
  const filterResultsByAnchor = { '': { value: {} } };

  if (anchorConfig !== undefined)
    for (const anchorValue of anchorConfig.options)
      filterResultsByAnchor[`${anchorConfig.field}:${anchorValue}`] = {
        value: {},
      };

  if (filterResults.value !== undefined)
    for (const [filterKey, filterValues] of Object.entries(filterResults.value))
      if (filterValues.__type === FILTER_TYPE.ANCHORED) {
        filterResultsByAnchor[filterKey] = filterValues.filter;
      } else {
        filterResultsByAnchor[''].value[filterKey] = filterValues;
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
    if (field in filterResults.value) {
      const filterValues = filterResults.value[field];
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
 * @param {AnchorConfig} [args.anchorConfig]
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
  const newFilterResults = { value: {} };
  for (const field of Object.keys(filterResults.value)) {
    const filterValues = filterResults.value[field];
    if (filterValues.__type === FILTER_TYPE.ANCHORED) {
      const newAnchoredFilterResults = /** @type {SimpleFilterState} */ (
        removeEmptyFilter(filterValues.filter)
      );
      if (Object.keys(newAnchoredFilterResults.value).length > 0)
        newFilterResults.value[field] = {
          __type: FILTER_TYPE.ANCHORED,
          filter: newAnchoredFilterResults,
        };
    } else {
      const hasRangeFilter = filterValues.__type === FILTER_TYPE.RANGE;
      const hasOptionFilter =
        filterValues.__type === FILTER_TYPE.OPTION &&
        filterValues.selectedValues?.length > 0;
      // Filter settings are prefaced with two underscores, e.g., __combineMode
      // A given config setting is still informative to Guppy even if the setting becomes empty
      const hasConfigSetting = Object.keys(filterValues).some(
        (x) => x !== '__type' && x.startsWith('__')
      );
      if (hasRangeFilter || hasOptionFilter || hasConfigSetting) {
        newFilterResults.value[field] = filterValues;
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
    newFilterResults.value[fieldName] = /** @type {BasicFilter} */ ({});
  } else {
    /** @type {AnchoredFilterState} */ (
      newFilterResults.value[anchorLabel]
    ).filter.value[fieldName] = /** @type {BasicFilter} */ ({});
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
    newFilterTabStatus[anchorLabel][sectionIndex][combineModeFieldName] =
      combineModeValue;

  // update filter results
  let newFilterResults = cloneDeep(filterResults);
  const fieldName = filterTabs[tabIndex].fields[sectionIndex];
  if (anchorLabel === undefined || anchorLabel === '') {
    if (newFilterResults.value[fieldName] === undefined) {
      newFilterResults.value[fieldName] = {
        [combineModeFieldName]: combineModeValue,
        __type: FILTER_TYPE.OPTION,
      };
    } else {
      newFilterResults.value[fieldName][combineModeFieldName] =
        combineModeValue;
    }
  } else {
    if (!(anchorLabel in newFilterResults.value))
      newFilterResults.value[anchorLabel] = {
        __type: FILTER_TYPE.ANCHORED,
        filter: { value: {} },
      };
    if (!('filter' in newFilterResults.value[anchorLabel]))
      /** @type {AnchoredFilterState} */ (
        newFilterResults.value[anchorLabel]
      ).filter.value = {};
    const newAnchoredFilterResults = /** @type {AnchoredFilterState} */ (
      newFilterResults.value[anchorLabel]
    );
    if (newAnchoredFilterResults.filter.value[fieldName] === undefined) {
      newAnchoredFilterResults.filter.value[fieldName] = {
        [combineModeFieldName]: combineModeValue,
        __type: FILTER_TYPE.OPTION,
      };
    } else {
      newAnchoredFilterResults.filter.value[fieldName][combineModeFieldName] =
        combineModeValue;
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
  if (newFilterResults.value === undefined) newFilterResults.value = {};
  const fieldName = filterTabs[tabIndex].fields[sectionIndex];
  if (anchorLabel === undefined || anchorLabel === '') {
    newFilterResults.value[fieldName] = {
      __type: FILTER_TYPE.RANGE,
      lowerBound,
      upperBound,
    };
    // if lowerbound and upperbound values equal min and max,
    // remove this range from filter
    if (
      Math.abs(lowerBound - minValue) < rangeStep &&
      Math.abs(upperBound - maxValue) < rangeStep
    ) {
      delete newFilterResults.value[fieldName];
    }
  } else {
    if (!(anchorLabel in newFilterResults.value))
      newFilterResults.value[anchorLabel] = {
        __type: FILTER_TYPE.ANCHORED,
        filter: { value: {} },
      };
    if (newFilterResults.value[anchorLabel].__type !== FILTER_TYPE.ANCHORED)
      /** @type {AnchoredFilterState} */ (
        newFilterResults.value[anchorLabel]
      ).filter.value = {};
    const newAnchoredFilterResults = /** @type {AnchoredFilterState} */ (
      newFilterResults.value[anchorLabel]
    ).filter;
    newAnchoredFilterResults.value[fieldName] = {
      __type: FILTER_TYPE.RANGE,
      lowerBound,
      upperBound,
    };
    // if lowerbound and upperbound values equal min and max,
    // remove this range from filter
    if (
      Math.abs(lowerBound - minValue) < rangeStep &&
      Math.abs(upperBound - maxValue) < rangeStep
    ) {
      delete newAnchoredFilterResults.value[fieldName];
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
  if (newFilterResults.value === undefined) newFilterResults.value = {};
  const fieldName = filterTabs[tabIndex].fields[sectionIndex];
  if (anchorLabel === undefined || anchorLabel === '') {
    if (newFilterResults.value[fieldName] === undefined)
      newFilterResults.value[fieldName] = {
        __type: FILTER_TYPE.OPTION,
        selectedValues: [selectedValue],
      };
    else if (
      /** @type {OptionFilter} */ (newFilterResults.value[fieldName])
        .selectedValues === undefined
    )
      /** @type {OptionFilter} */ (
        newFilterResults.value[fieldName]
      ).selectedValues = [selectedValue];
    else {
      const { selectedValues } = /** @type {OptionFilter} */ (
        newFilterResults.value[fieldName]
      );
      const selectedValueIndex = selectedValues.indexOf(selectedValue);
      if (selectedValueIndex >= 0 && !isSelected)
        selectedValues.splice(selectedValueIndex, 1);
      else if (selectedValueIndex < 0 && isSelected)
        selectedValues.push(selectedValue);
    }
  } else {
    if (!(anchorLabel in newFilterResults.value))
      newFilterResults.value[anchorLabel] = {
        __type: FILTER_TYPE.ANCHORED,
        filter: { value: {} },
      };
    if (newFilterResults.value[anchorLabel].__type !== FILTER_TYPE.ANCHORED)
      /** @type {AnchoredFilterState} */ (
        newFilterResults.value[anchorLabel]
      ).filter.value = {};
    const newAnchoredFilterResults = /** @type {AnchoredFilterState} */ (
      newFilterResults.value[anchorLabel]
    ).filter;
    if (newAnchoredFilterResults.value[fieldName] === undefined)
      newAnchoredFilterResults.value[fieldName] = {
        __type: FILTER_TYPE.OPTION,
        selectedValues: [selectedValue],
      };
    else if (
      /** @type {OptionFilter} */ (newAnchoredFilterResults.value[fieldName])
        .selectedValues === undefined
    )
      /** @type {OptionFilter} */ (
        newAnchoredFilterResults.value[fieldName]
      ).selectedValues = [selectedValue];
    else {
      const { selectedValues } = /** @type {OptionFilter} */ (
        newAnchoredFilterResults.value[fieldName]
      );
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
