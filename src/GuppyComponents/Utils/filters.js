import flat from 'flat';

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
    if (Object.prototype.hasOwnProperty.call(userFilter, key)
          && Object.prototype.hasOwnProperty.call(adminAppliedPreFilter, key)) {
      const userFilterSubset = userFilter[key].selectedValues.filter(
        (x) => adminAppliedPreFilter[key].selectedValues.includes(x),
      );
      if (userFilterSubset.length > 0) {
        // The user-applied filter is more exclusive than the admin-applied filter.
        filterAB[key].selectedValues = userFilter[key].selectedValues;
      } else {
        // The admin-applied filter is more exclusive than the user-applied filter.
        filterAB[key].selectedValues = adminAppliedPreFilter[key].selectedValues;
      }
    } else if (Object.prototype.hasOwnProperty.call(adminAppliedPreFilter, key)) {
      filterAB[key] = { selectedValues: adminAppliedPreFilter[key].selectedValues };
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
  initialTabsOptions, processedTabsOptions, filtersApplied,
) => {
  const updatedTabsOptions = {};
  try {
    // flatten the tab options first
    // {
    //   project_id.histogram: ...
    //   visit.visit_label.histogram: ...
    // }
    const flattenInitialTabsOptions = flat(initialTabsOptions, { safe: true });
    const flattenProcessedTabsOptions = flat(processedTabsOptions, { safe: true });
    Object.keys(flattenInitialTabsOptions).forEach((field) => {
      // in flattened tab options, to get actual field name, strip off the last '.histogram'
      const actualFieldName = field.replace('.histogram', '');
      // possible to have '.' in actualFieldName, so use it as a string
      updatedTabsOptions[`${actualFieldName}`] = { histogram: [] };
      const histogram = flattenInitialTabsOptions[`${field}`];
      if (!histogram) {
        console.error(`Guppy did not return histogram data for filter field ${actualFieldName}`); // eslint-disable-line no-console
      }
      histogram.forEach((opt) => {
        const { key } = opt;
        if (typeof (key) !== 'string') { // key is a range, just copy the histogram
          updatedTabsOptions[`${actualFieldName}`].histogram = flattenInitialTabsOptions[`${field}`];
          if (flattenProcessedTabsOptions[`${field}`]
            && flattenProcessedTabsOptions[`${field}`].length > 0
            && updatedTabsOptions[`${actualFieldName}`].histogram) {
            updatedTabsOptions[`${actualFieldName}`].histogram[0].count = flattenProcessedTabsOptions[`${field}`][0].count;
            const newKey = [0, 0];
            if (flattenProcessedTabsOptions[`${field}`][0].key[0]) {
              // because of the prefer-destructuring eslint rule
              const newLowerBound = flattenProcessedTabsOptions[`${field}`][0].key[0];
              newKey[0] = newLowerBound;
            }
            if (flattenProcessedTabsOptions[`${field}`][0].key[1]) {
              const newHigherBound = flattenProcessedTabsOptions[`${field}`][0].key[1];
              newKey[1] = newHigherBound;
            }
            updatedTabsOptions[`${actualFieldName}`].histogram[0].key = newKey;
          }
          return;
        }
        const findOpt = flattenProcessedTabsOptions[`${field}`].find((o) => o.key === key);
        if (findOpt) {
          const { count } = findOpt;
          updatedTabsOptions[`${actualFieldName}`].histogram.push({ key, count });
        }
      });
      if (filtersApplied[`${actualFieldName}`]) {
        if (filtersApplied[`${actualFieldName}`].selectedValues) {
          filtersApplied[`${actualFieldName}`].selectedValues.forEach((optKey) => {
            if (!updatedTabsOptions[`${actualFieldName}`].histogram.find((o) => o.key === optKey)) {
              updatedTabsOptions[`${actualFieldName}`].histogram.push({ key: optKey, count: 0 });
            }
          });
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

  const allOptionKeys = [...new Set([
    ...Object.keys(firstTabsOptions),
    ...Object.keys(secondTabsOptions),
  ])];
  const mergedTabOptions = {};
  allOptionKeys.forEach((optKey) => {
    if (!mergedTabOptions[`${optKey}`]) {
      mergedTabOptions[`${optKey}`] = {};
    }
    if (!mergedTabOptions[`${optKey}`].histogram) {
      mergedTabOptions[`${optKey}`].histogram = [];
    }
    const firstHistogram = (firstTabsOptions[`${optKey}`] && firstTabsOptions[`${optKey}`].histogram) ? firstTabsOptions[`${optKey}`].histogram : [];
    const secondHistogram = (secondTabsOptions[`${optKey}`] && secondTabsOptions[`${optKey}`].histogram) ? secondTabsOptions[`${optKey}`].histogram : [];
    mergedTabOptions[`${optKey}`].histogram = firstHistogram.concat(secondHistogram);
  });
  return mergedTabOptions;
};
