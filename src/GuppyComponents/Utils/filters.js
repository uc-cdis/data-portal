import flat from 'flat';
import { queryGuppyForRawData } from './queries';

/**
 * This function takes two objects containing filters to be applied
 * and combines them into one filter object in the same format.
 * Note: the admin filter takes precedence. Selected values in the user
 * filter will be discarded if the key collides. This is to avoid
 * the user undoing the admin filter. (Multiple user checkboxes increase the
 * amount of data shown when combined, but an admin filter should always decrease
 * or keep constant the amount of data shown when combined with a user filter).
 * */
export const mergeFilters = (userFilter, adminAppliedPreFilter) => {
  const filterAB = { ...userFilter };
  Object.keys(adminAppliedPreFilter).forEach((key) => {
    if (
      Object.prototype.hasOwnProperty.call(userFilter, key) &&
      Object.prototype.hasOwnProperty.call(adminAppliedPreFilter, key)
    ) {
      const userFilterSubset = userFilter[key].selectedValues.filter((x) =>
        adminAppliedPreFilter[key].selectedValues.includes(x)
      );
      if (userFilterSubset.length > 0) {
        // The user-applied filter is more exclusive than the admin-applied filter.
        filterAB[key].selectedValues = userFilter[key].selectedValues;
      } else {
        // The admin-applied filter is more exclusive than the user-applied filter.
        filterAB[key].selectedValues =
          adminAppliedPreFilter[key].selectedValues;
      }
    } else if (
      Object.prototype.hasOwnProperty.call(adminAppliedPreFilter, key)
    ) {
      filterAB[key] = {
        selectedValues: adminAppliedPreFilter[key].selectedValues,
      };
    }
  });

  return filterAB;
};

/**
 * This function updates the counts in the initial set of tab options
 * calculated from unfiltered data.
 * It is used to retain field options in the rendering if
 * they are still checked but their counts are zero.
 */
export const updateCountsInInitialTabsOptions = (
  initialTabsOptions,
  processedTabsOptions,
  filtersApplied
) => {
  const updatedTabsOptions = {};
  try {
    // flatten the tab options first
    // {
    //   project_id.histogram: ...
    //   visit.visit_label.histogram: ...
    // }
    const flattenInitialTabsOptions = flat(initialTabsOptions, { safe: true });
    const flattenProcessedTabsOptions = flat(processedTabsOptions, {
      safe: true,
    });
    Object.keys(flattenInitialTabsOptions).forEach((field) => {
      // in flattened tab options, to get actual field name, strip off the last '.histogram'
      const actualFieldName = field.replace('.histogram', '');
      // possible to have '.' in actualFieldName, so use it as a string
      updatedTabsOptions[`${actualFieldName}`] = { histogram: [] };
      const histogram = flattenInitialTabsOptions[`${field}`];
      if (!histogram) {
        console.error(
          `Guppy did not return histogram data for filter field ${actualFieldName}`
        ); // eslint-disable-line no-console
      }
      histogram.forEach((opt) => {
        const { key } = opt;
        if (typeof key !== 'string') {
          // key is a range, just copy the histogram
          updatedTabsOptions[`${actualFieldName}`].histogram =
            flattenInitialTabsOptions[`${field}`];
          if (
            flattenProcessedTabsOptions[`${field}`] &&
            flattenProcessedTabsOptions[`${field}`].length > 0 &&
            updatedTabsOptions[`${actualFieldName}`].histogram
          ) {
            updatedTabsOptions[`${actualFieldName}`].histogram[0].count =
              flattenProcessedTabsOptions[`${field}`][0].count;
            const newKey = [0, 0];
            if (flattenProcessedTabsOptions[`${field}`][0].key[0]) {
              // because of the prefer-destructuring eslint rule
              const newLowerBound =
                flattenProcessedTabsOptions[`${field}`][0].key[0];
              newKey[0] = newLowerBound;
            }
            if (flattenProcessedTabsOptions[`${field}`][0].key[1]) {
              const newHigherBound =
                flattenProcessedTabsOptions[`${field}`][0].key[1];
              newKey[1] = newHigherBound;
            }
            updatedTabsOptions[`${actualFieldName}`].histogram[0].key = newKey;
          }
          return;
        }
        const findOpt = flattenProcessedTabsOptions[`${field}`].find(
          (o) => o.key === key
        );
        if (findOpt) {
          const { count } = findOpt;
          updatedTabsOptions[`${actualFieldName}`].histogram.push({
            key,
            count,
          });
        }
      });
      if (filtersApplied[`${actualFieldName}`]) {
        if (filtersApplied[`${actualFieldName}`].selectedValues) {
          filtersApplied[`${actualFieldName}`].selectedValues.forEach(
            (optKey) => {
              if (
                !updatedTabsOptions[`${actualFieldName}`].histogram.find(
                  (o) => o.key === optKey
                )
              ) {
                updatedTabsOptions[`${actualFieldName}`].histogram.push({
                  key: optKey,
                  count: 0,
                });
              }
            }
          );
        }
      }
    });
  } catch (err) {
    /* eslint-disable no-console */
    // hopefully we won't get here but in case of
    // out-of-index error or obj undefined error
    console.error('error when processing filter data: ', err);
    console.trace();
    /* eslint-enable no-console */
  }
  return updatedTabsOptions;
};

export const sortTabsOptions = (tabsOptions) => {
  const fields = Object.keys(tabsOptions);
  const sortedTabsOptions = { ...tabsOptions };
  for (let x = 0; x < fields.length; x += 1) {
    const field = fields[x];

    const optionsForThisField = sortedTabsOptions[field].histogram;
    optionsForThisField.sort((a, b) => (a.key > b.key ? 1 : -1));
    sortedTabsOptions[field].histogram = optionsForThisField;
  }
  return sortedTabsOptions;
};

/**
 * This function takes two TabsOptions object and merge them together
 * The order of merged histogram array is preserved by firstHistogram.concat(secondHistogram)
 */
export const mergeTabOptions = (firstTabsOptions, secondTabsOptions) => {
  if (!firstTabsOptions || !Object.keys(firstTabsOptions).length) {
    return secondTabsOptions;
  }
  if (!secondTabsOptions || !Object.keys(secondTabsOptions).length) {
    return firstTabsOptions;
  }

  const allOptionKeys = [
    ...new Set([
      ...Object.keys(firstTabsOptions),
      ...Object.keys(secondTabsOptions),
    ]),
  ];
  const mergedTabOptions = {};
  allOptionKeys.forEach((optKey) => {
    if (!mergedTabOptions[`${optKey}`]) {
      mergedTabOptions[`${optKey}`] = {};
    }
    if (!mergedTabOptions[`${optKey}`].histogram) {
      mergedTabOptions[`${optKey}`].histogram = [];
    }
    const firstHistogram =
      firstTabsOptions[`${optKey}`] && firstTabsOptions[`${optKey}`].histogram
        ? firstTabsOptions[`${optKey}`].histogram
        : [];
    const secondHistogram =
      secondTabsOptions[`${optKey}`] && secondTabsOptions[`${optKey}`].histogram
        ? secondTabsOptions[`${optKey}`].histogram
        : [];
    mergedTabOptions[`${optKey}`].histogram = firstHistogram.concat(
      secondHistogram
    );
  });
  return mergedTabOptions;
};

export const getFilterGroupConfig = (filterConfig) => ({
  tabs: filterConfig.tabs.map((t) => ({
    title: t.title,
    fields: t.filters.map((f) => f.field),
  })),
});

const getSingleFilterOption = (histogramResult, initHistogramRes) => {
  if (!histogramResult || !histogramResult.histogram) {
    throw new Error(
      `Error parsing field options ${JSON.stringify(histogramResult)}`
    );
  }
  // if this is for range slider
  if (
    histogramResult.histogram.length === 1 &&
    typeof histogramResult.histogram[0].key !== 'string'
  ) {
    const rangeOptions = histogramResult.histogram.map((item) => {
      const minValue = initHistogramRes
        ? initHistogramRes.histogram[0].key[0]
        : item.key[0];
      const maxValue = initHistogramRes
        ? initHistogramRes.histogram[0].key[1]
        : item.key[1];
      return {
        filterType: 'range',
        min: Math.floor(minValue),
        max: Math.ceil(maxValue),
        lowerBound: item.key[0],
        upperBound: item.key[1],
        count: item.count,
      };
    });
    return rangeOptions;
  }

  const textOptions = histogramResult.histogram.map((item) => ({
    text: item.key,
    filterType: 'singleSelect',
    count: item.count,
    accessible: item.accessible,
  }));
  return textOptions;
};

const capitalizeFirstLetter = (str) => {
  const res = str.replace(/_|\./gi, ' ');
  return res.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

// createSearchFilterLoadOptionsFn creates a handler function that loads the search filter's
// autosuggest options as the user types in the search filter.
const createSearchFilterLoadOptionsFn = (field, guppyConfig) => (
  searchString,
  offset
) => {
  const NUM_SEARCH_OPTIONS = 20;
  return new Promise((resolve, reject) => {
    // If searchString is empty return just the first NUM_SEARCH_OPTIONS options.
    // This allows the client to show default options in the search filter before
    // the user has started searching.
    let filter = {};
    if (searchString) {
      filter = {
        search: {
          keyword: searchString,
          fields: [field],
        },
      };
    }
    queryGuppyForRawData(
      guppyConfig.path,
      guppyConfig.type,
      [field],
      filter,
      undefined,
      offset,
      NUM_SEARCH_OPTIONS,
      true
    )
      .then((res) => {
        if (!res.data || !res.data[guppyConfig.type]) {
          resolve({
            options: [],
            hasMore: false,
          });
        } else {
          const results = res.data[guppyConfig.type];
          const totalCount =
            res.data._aggregation[guppyConfig.type]._totalCount;
          resolve({
            options: results.map((result) => ({
              value: result[field],
              label: result[field],
            })),
            hasMore: totalCount > offset + results.length,
          });
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const checkIsArrayField = (field, arrayFields) => {
  let isArrayField = false;
  const keys = Object.keys(arrayFields);
  for (let i = 0; i < keys.length; i += 1) {
    if (arrayFields[keys[i]].includes(field)) {
      isArrayField = true;
    }
  }
  return isArrayField;
};

export const getFilterSections = (
  fields,
  searchFields,
  fieldMapping,
  tabsOptions,
  initialTabsOptions,
  adminAppliedPreFilters,
  guppyConfig,
  arrayFields
) => {
  let searchFieldSections = [];

  if (searchFields) {
    // Process searchFields first -- searchFields are special filters that allow the user
    // to search over all options, instead of displaying all options in a list. This allows
    // guppy/portal to support filters that have too many options to be displayed in a list.
    searchFieldSections = searchFields.map((field) => {
      const overrideName = fieldMapping.find((entry) => entry.field === field);
      const label = overrideName
        ? overrideName.name
        : capitalizeFirstLetter(field);

      const tabsOptionsFiltered = { ...tabsOptions[field] };
      if (Object.keys(adminAppliedPreFilters).includes(field)) {
        tabsOptionsFiltered.histogram = tabsOptionsFiltered.histogram.filter(
          (x) => adminAppliedPreFilters[field].selectedValues.includes(x.key)
        );
      }

      // For searchFields, don't pass all options to the component, only the selected ones.
      // This allows selected options to appear below the search box once they are selected.
      let selectedOptions = [];
      if (tabsOptionsFiltered && tabsOptionsFiltered.histogram) {
        selectedOptions = getSingleFilterOption(
          tabsOptionsFiltered,
          initialTabsOptions ? initialTabsOptions[field] : undefined
        );
      }

      return {
        title: label,
        options: selectedOptions,
        isSearchFilter: true,
        onSearchFilterLoadOptions: createSearchFilterLoadOptionsFn(
          field,
          guppyConfig
        ),
      };
    });
  }

  const sections = fields.map((field) => {
    const overrideName = fieldMapping.find((entry) => entry.field === field);
    const label = overrideName
      ? overrideName.name
      : capitalizeFirstLetter(field);

    const tabsOptionsFiltered = { ...tabsOptions[field] };
    if (Object.keys(adminAppliedPreFilters).includes(field)) {
      tabsOptionsFiltered.histogram = tabsOptionsFiltered.histogram.filter(
        (x) => adminAppliedPreFilters[field].selectedValues.includes(x.key)
      );
    }

    const defaultOptions = getSingleFilterOption(
      tabsOptionsFiltered,
      initialTabsOptions ? initialTabsOptions[field] : undefined
    );

    const fieldIsArrayField = checkIsArrayField(field, arrayFields);

    return {
      title: label,
      options: defaultOptions,
      isArrayField: fieldIsArrayField,
    };
  });
  return searchFieldSections.concat(sections);
};

export const excludeSelfFilterFromAggsData = (
  receivedAggsData,
  filterResults
) => {
  if (!filterResults) return receivedAggsData;
  const resultAggsData = {};
  const flattenAggsData = flat(receivedAggsData, { safe: true });
  Object.keys(flattenAggsData).forEach((field) => {
    const actualFieldName = field.replace('.histogram', '');
    const histogram = flattenAggsData[`${field}`];
    if (!histogram) return;
    if (actualFieldName in filterResults) {
      let resultHistogram = [];
      if (
        typeof filterResults[`${actualFieldName}`].selectedValues !==
        'undefined'
      ) {
        const { selectedValues } = filterResults[`${actualFieldName}`];
        resultHistogram = histogram.filter((bucket) =>
          selectedValues.includes(bucket.key)
        );
      }
      resultAggsData[`${actualFieldName}`] = { histogram: resultHistogram };
    } else {
      resultAggsData[`${actualFieldName}`] = {
        histogram: flattenAggsData[`${field}`],
      };
    }
  });
  return resultAggsData;
};
