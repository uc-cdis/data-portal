import cloneDeep from 'lodash.clonedeep';
import { FILTER_TYPE } from '../../../../GuppyComponents/Utils/const';

export { FILTER_TYPE } from '../../../../GuppyComponents/Utils/const';

/** @typedef {import('../types').AnchorConfig} AnchorConfig */
/** @typedef {import('../types').AnchoredFilterState} AnchoredFilterState */
/** @typedef {import('../types').AnchoredFilterTabStatus} AnchoredFilterTabStatus */
/** @typedef {import('../types').FilterSectionStatus} FilterSectionStatus */
/** @typedef {import('../types').FilterStatus} FilterStatus */
/** @typedef {import('../types').FilterTabsOption} FilterTabsOption */
/** @typedef {import('../types').FilterTabStatus} FilterTabStatus */
/** @typedef {import('../types').BaseFilter} BaseFilter */
/** @typedef {import('../types').OptionFilter} OptionFilter */

/** @typedef {import('../types').StandardFilterState} StandardFilterState */

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
 * @param {FilterTabsOption[]} filterTabs
 * @param {EmptyFilter | StandardFilterState} filterResults
 */
export function getExcludedStatus(filterTabs, filterResults) {
  return filterTabs.map(({ fields }) =>
    fields.map((field) => filterResults.value?.[field]?.isExclusion || false)
  );
}

/**
 * @param {Object} args
 * @param {AnchorConfig} [args.anchorConfig]
 * @param {StandardFilterState} args.filterResults
 */
export function getFilterResultsByAnchor({ anchorConfig, filterResults }) {
  /** @type {{ [anchorLabel: string]: AnchoredFilterState['value'] }} */
  const filterResultsByAnchor = { '': { value: {} } };

  if (anchorConfig !== undefined)
    for (const anchorValue of anchorConfig.options)
      filterResultsByAnchor[`${anchorConfig.field}:${anchorValue}`] = {
        value: {},
      };

  if (filterResults.value !== undefined)
    for (const [filterKey, filterValues] of Object.entries(filterResults.value))
      if (filterValues.__type === FILTER_TYPE.ANCHORED) {
        filterResultsByAnchor[filterKey].value = filterValues.value;
      } else {
        filterResultsByAnchor[''].value[filterKey] = filterValues;
      }

  return filterResultsByAnchor;
}

/**
 * @param {string[]} fields
 * @param {StandardFilterState} filterResults
 * @returns {FilterTabStatus}
 */
function getFilterTabStatus(fields, filterResults) {
  return fields.map((field) => {
    if (field in filterResults.value) {
      const filterValues = filterResults.value[field];
      if (filterValues.__type === FILTER_TYPE.OPTION) {
        const status = {};
        for (const selected of filterValues.selectedValues)
          status[selected] = true;
        return status;
      }
      if (filterValues.__type === FILTER_TYPE.RANGE) {
        return [filterValues.lowerBound, filterValues.upperBound];
      }
    }
    return {};
  });
}

/**
 * @param {Object} args
 * @param {AnchorConfig} [args.anchorConfig]
 * @param {StandardFilterState} args.filterResults
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

/** @param {BaseFilter} baseFilter */
function _isNonEmptyFilter(baseFilter) {
  const hasRangeFilter = baseFilter.__type === FILTER_TYPE.RANGE;
  const hasOptionFilter =
    baseFilter.__type === FILTER_TYPE.OPTION &&
    baseFilter.selectedValues?.length > 0;
  // Filter settings are prefaced with two underscores, e.g., __combineMode
  // A given config setting is still informative to Guppy even if the setting becomes empty
  const hasConfigSetting = Object.keys(baseFilter).some(
    (x) => x !== '__type' && x.startsWith('__')
  );

  return hasRangeFilter || hasOptionFilter || hasConfigSetting;
}

/**
 * @param {AnchoredFilterState} anchoredFilter
 * @returns {AnchoredFilterState}
 */
function _removeEmptyFilter(anchoredFilter) {
  const newValue = /** @type {AnchoredFilterState['value']} */ ({});
  for (const [field, filter] of Object.entries(anchoredFilter.value))
    if (_isNonEmptyFilter(filter)) newValue[field] = filter;

  return { ...anchoredFilter, value: newValue };
}

/**
 * @param {StandardFilterState} filterResults
 * @returns {StandardFilterState}
 */
export function removeEmptyFilter(filterResults) {
  const newValue = /** @type {StandardFilterState['value']} */ ({});
  for (const [field, filter] of Object.entries(filterResults.value))
    if (filter.__type === FILTER_TYPE.ANCHORED) {
      const newAnchoredFilter = _removeEmptyFilter(filter);
      if (Object.keys(newAnchoredFilter.value).length > 0)
        newValue[field] = newAnchoredFilter;
    } else if (_isNonEmptyFilter(filter)) {
      newValue[field] = filter;
    }

  return { ...filterResults, value: newValue };
}

/**
 * @param {Object} args
 * @param {FilterStatus} args.filterStatus
 * @param {StandardFilterState} args.filterResults
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
    newFilterResults.value[fieldName] = /** @type {BaseFilter} */ ({});
  } else {
    /** @type {AnchoredFilterState} */ (
      newFilterResults.value[anchorLabel]
    ).value[fieldName] = /** @type {BaseFilter} */ ({});
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
 * @param {StandardFilterState} args.filterResults
 * @param {FilterTabsOption[]} args.filterTabs
 * @param {number} args.tabIndex
 * @param {string} args.anchorLabel
 * @param {number} args.sectionIndex
 * @param {boolean} args.isExclusion
 */
export function updateExclusion({
  filterResults,
  filterTabs,
  tabIndex,
  anchorLabel,
  sectionIndex,
  isExclusion,
}) {
  const newFilterResults = cloneDeep(filterResults);

  const fieldName = filterTabs[tabIndex].fields[sectionIndex];
  if (!anchorLabel) {
    newFilterResults.value[fieldName] = {
      ...newFilterResults.value[fieldName],
      selectedValues: newFilterResults.value[fieldName]?.selectedValues ?? [],
      __type: FILTER_TYPE.OPTION,
      isExclusion,
    };
  } else {
    if (!(anchorLabel in newFilterResults.value)) {
      newFilterResults.value[anchorLabel] = {
        __type: FILTER_TYPE.ANCHORED,
        value: {},
      };
    }
    newFilterResults.value[anchorLabel].value[fieldName] = {
      ...newFilterResults.value[anchorLabel].value[fieldName],
      selectedValues:
        newFilterResults.value[anchorLabel].value[fieldName]?.selectedValues ??
        [],
      __type: FILTER_TYPE.OPTION,
      isExclusion,
    };
  }

  return {
    filterResults: removeEmptyFilter(newFilterResults),
  };
}

/**
 * @param {Object} args
 * @param {FilterStatus} args.filterStatus
 * @param {StandardFilterState} args.filterResults
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
        value: {},
      };
    if (newFilterResults.value[anchorLabel].__type !== FILTER_TYPE.ANCHORED)
      /** @type {AnchoredFilterState} */ (
        newFilterResults.value[anchorLabel]
      ).value = {};
    const newAnchoredFilterResults = /** @type {AnchoredFilterState} */ (
      newFilterResults.value[anchorLabel]
    );
    if (newAnchoredFilterResults.value[fieldName] === undefined) {
      newAnchoredFilterResults.value[fieldName] = {
        [combineModeFieldName]: combineModeValue,
        __type: FILTER_TYPE.OPTION,
      };
    } else {
      newAnchoredFilterResults.value[fieldName][combineModeFieldName] =
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
 * @param {StandardFilterState} args.filterResults
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
        value: {},
      };
    if (newFilterResults.value[anchorLabel].__type !== FILTER_TYPE.ANCHORED)
      /** @type {AnchoredFilterState} */ (
        newFilterResults.value[anchorLabel]
      ).value = {};
    const newAnchoredFilterResults = /** @type {AnchoredFilterState} */ (
      newFilterResults.value[anchorLabel]
    );
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
 * @param {StandardFilterState} args.filterResults
 * @param {FilterTabsOption[]} args.filterTabs
 * @param {number} args.tabIndex
 * @param {string} args.anchorLabel
 * @param {number} args.sectionIndex
 * @param {string} args.selectedValue
 * @param {boolean} args.isExclusion
 */
export function updateSelectedValue({
  filterStatus,
  filterResults,
  filterTabs,
  tabIndex,
  anchorLabel,
  sectionIndex,
  selectedValue,
  isExclusion,
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
    newFilterResults.value[fieldName].isExclusion = isExclusion;
  } else {
    if (!(anchorLabel in newFilterResults.value))
      newFilterResults.value[anchorLabel] = {
        __type: FILTER_TYPE.ANCHORED,
        value: {},
      };
    if (newFilterResults.value[anchorLabel].__type !== FILTER_TYPE.ANCHORED)
      /** @type {AnchoredFilterState} */ (
        newFilterResults.value[anchorLabel]
      ).value = {};
    const newAnchoredFilterResults = /** @type {AnchoredFilterState} */ (
      newFilterResults.value[anchorLabel]
    );
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
    /** @type {OptionFilter} */ (
      newAnchoredFilterResults.value[fieldName]
    ).isExclusion = isExclusion;
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
