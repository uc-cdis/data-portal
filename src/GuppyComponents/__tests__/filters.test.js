/* eslint-disable global-require,import/no-dynamic-require */
// Tests for Utils/filters.js
import {
  mergeFilters,
  updateCountsInInitialTabsOptions,
  sortTabsOptions,
} from '../Utils/filters';
import { FILTER_TYPE } from '../Utils/const';

describe('can merge with undefined user filter', () => {
  const __type = FILTER_TYPE.OPTION;
  const userFilter = undefined;
  const adminFilter = { project_id: { selectedValues: ['jnkns-jenkins'] } };

  const mergedFilterExpected = {
    value: {
      project_id: { __type, selectedValues: ['jnkns-jenkins'] },
    },
  };

  test('merge filters', async () => {
    const mergedFilter = mergeFilters(userFilter, adminFilter);
    expect(mergedFilter).toEqual(mergedFilterExpected);
  });
});

describe('can merge with empty user filter', () => {
  const __type = FILTER_TYPE.OPTION;
  const userFilter = {};
  const adminFilter = { project_id: { selectedValues: ['jnkns-jenkins'] } };

  const mergedFilterExpected = {
    value: {
      project_id: { __type, selectedValues: ['jnkns-jenkins'] },
    },
  };

  test('merge filters', async () => {
    const mergedFilter = mergeFilters(userFilter, adminFilter);
    expect(mergedFilter).toEqual(mergedFilterExpected);
  });
});

describe('can merge simple selectedValue filters', () => {
  const __type = FILTER_TYPE.OPTION;
  const userFilter = {
    value: { data_format: { __type, selectedValues: ['VCF'] } },
  };
  const adminFilter = { project_id: { selectedValues: ['jnkns-jenkins'] } };

  const mergedFilterExpected = {
    value: {
      project_id: { __type, selectedValues: ['jnkns-jenkins'] },
      data_format: { __type, selectedValues: ['VCF'] },
    },
  };

  test('merge filters', async () => {
    const mergedFilter = mergeFilters(userFilter, adminFilter);
    expect(mergedFilter).toEqual(mergedFilterExpected);
  });
});

describe('can merge admin-provided selectedValue filters with user-provided range filters', () => {
  const userFilter = {
    value: {
      bmi: { __type: FILTER_TYPE.RANGE, lowerBound: 28, upperBound: 99 },
      age: { __type: FILTER_TYPE.RANGE, lowerBound: 26, upperBound: 33 },
      data_type: {
        __type: FILTER_TYPE.OPTION,
        selectedValues: ['Aligned Reads'],
      },
    },
  };
  const adminFilter = {
    project_id: { selectedValues: ['jnkns-jenkins', 'jnkns-jenkins2'] },
  };

  const mergedFilterExpected = {
    value: {
      project_id: {
        __type: FILTER_TYPE.OPTION,
        selectedValues: ['jnkns-jenkins', 'jnkns-jenkins2'],
      },
      bmi: { __type: FILTER_TYPE.RANGE, lowerBound: 28, upperBound: 99 },
      age: { __type: FILTER_TYPE.RANGE, lowerBound: 26, upperBound: 33 },
      data_type: {
        __type: FILTER_TYPE.OPTION,
        selectedValues: ['Aligned Reads'],
      },
    },
  };

  test('merge filters', async () => {
    const mergedFilter = mergeFilters(userFilter, adminFilter);
    expect(mergedFilter).toEqual(mergedFilterExpected);
  });
});

describe('will select user-applied filter for a given key if it is more exclusive than admin filter', () => {
  const userFilter = {
    value: {
      project_id: {
        __type: FILTER_TYPE.OPTION,
        selectedValues: ['jnkns-jenkins2'],
      },
      age: { __type: FILTER_TYPE.RANGE, lowerBound: 26, upperBound: 33 },
      data_type: {
        __type: FILTER_TYPE.OPTION,
        selectedValues: ['Aligned Reads'],
      },
    },
  };
  const adminFilter = {
    project_id: { selectedValues: ['jnkns-jenkins', 'jnkns-jenkins2'] },
  };

  const mergedFilterExpected = {
    value: {
      project_id: {
        __type: FILTER_TYPE.OPTION,
        selectedValues: ['jnkns-jenkins2'],
      },
      age: { __type: FILTER_TYPE.RANGE, lowerBound: 26, upperBound: 33 },
      data_type: {
        __type: FILTER_TYPE.OPTION,
        selectedValues: ['Aligned Reads'],
      },
    },
  };

  test('merge filters', async () => {
    const mergedFilter = mergeFilters(userFilter, adminFilter);
    expect(mergedFilter).toEqual(mergedFilterExpected);
  });
});

describe('can update a small set of tabs with new counts', () => {
  const initialTabsOptions = {
    annotated_sex: {
      histogram: [
        { key: 'yellow', count: 137675 },
        { key: 'pink', count: 56270 },
        { key: 'silver', count: 2020 },
        { key: 'orange', count: 107574 },
      ],
    },
    extra_data: {
      histogram: [{ key: 'a', count: 2 }],
    },
  };

  const processedTabsOptions = {
    annotated_sex: {
      histogram: [
        { key: 'yellow', count: 1 },
        { key: 'orange', count: 107574 },
      ],
    },
    extra_data: { histogram: [] },
  };

  const filtersApplied = {
    value: {
      annotated_sex: { __type: FILTER_TYPE.OPTION, selectedValues: ['silver'] },
    },
  };

  // Silver has a count of zero, but it is in the filter, so it should remain visible
  const expectedUpdatedTabsOptions = {
    annotated_sex: {
      histogram: [
        { key: 'yellow', count: 1 },
        { key: 'orange', count: 107574 },
        { key: 'silver', count: 0 },
      ],
    },
    extra_data: {
      histogram: [],
    },
  };

  const actualUpdatedTabsOptions = updateCountsInInitialTabsOptions(
    initialTabsOptions,
    processedTabsOptions,
    filtersApplied
  );

  test('update tab counts', async () => {
    expect(actualUpdatedTabsOptions).toEqual(expectedUpdatedTabsOptions);
  });
});

describe('can update a small set of tabs with new counts, test with ranger slide', () => {
  const initialTabsOptions = {
    field1: {
      histogram: [
        { key: 'option1', count: 137675 },
        { key: 'option2', count: 56270 },
        { key: 'option3', count: 2020 },
        { key: 'option4', count: 107574 },
      ],
    },
    field2: {
      histogram: [
        {
          /** @type {[number, number]} */
          key: [0, 100],
          count: 100,
        },
      ],
    },
  };

  const processedTabsOptions = {
    field1: {
      histogram: [{ key: 'option3', count: 30 }],
    },
    field2: {
      histogram: [
        {
          /** @type {[number, number]} */
          key: [4, 39],
          count: 49,
        },
      ],
    },
  };

  const filtersApplied = {
    value: {
      field1: {
        __type: FILTER_TYPE.OPTION,
        selectedValues: ['option2'],
      },
      field2: {
        __type: FILTER_TYPE.RANGE,
        lowerBound: 4,
        upperBound: 39,
      },
    },
  };

  // option2 has a count of zero, but it is in the filter, so it should remain visible
  const expectedUpdatedTabsOptions = {
    field1: {
      histogram: [
        { key: 'option3', count: 30 },
        { key: 'option2', count: 0 },
      ],
    },
    field2: {
      histogram: [{ key: [4, 39], count: 49 }],
    },
  };

  const actualUpdatedTabsOptions = updateCountsInInitialTabsOptions(
    initialTabsOptions,
    processedTabsOptions,
    filtersApplied
  );

  test('update tab counts', async () => {
    expect(actualUpdatedTabsOptions).toEqual(expectedUpdatedTabsOptions);
  });
});

describe('can sort tabs options', () => {
  const tabsOptionsOne = {
    annotated_sex: {
      histogram: [
        { key: 'orange', count: 30 },
        { key: 'pink', count: 21 },
        { key: 'yellow', count: 99 },
        { key: 'zorp', count: 4162 },
        { key: 'shiny', count: 0 },
        { key: 'green', count: 0 },
        { key: 'blue', count: 0 },
      ],
    },
    extra_data: {
      histogram: [
        { key: 'b', count: 0 },
        { key: 'a', count: 0 },
        { key: 'c', count: 1 },
      ],
    },
  };

  const expectedSort = {
    annotated_sex: {
      histogram: [
        { key: 'blue', count: 0 },
        { key: 'green', count: 0 },
        { key: 'orange', count: 30 },
        { key: 'pink', count: 21 },
        { key: 'shiny', count: 0 },
        { key: 'yellow', count: 99 },
        { key: 'zorp', count: 4162 },
      ],
    },
    extra_data: {
      histogram: [
        { key: 'a', count: 0 },
        { key: 'b', count: 0 },
        { key: 'c', count: 1 },
      ],
    },
  };

  const actualSort = sortTabsOptions(tabsOptionsOne);

  test('test sorting tabs options', async () => {
    expect(actualSort).toEqual(expectedSort);
  });
});
