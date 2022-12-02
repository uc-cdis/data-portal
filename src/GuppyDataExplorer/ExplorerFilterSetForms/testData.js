import { configureStore } from '@reduxjs/toolkit';
import explorerReducer from '../../redux/explorer/slice';
import { FILTER_TYPE } from '../ExplorerFilterSetWorkspace/utils';

export const testReduxStore = configureStore({
  reducer: { explorer: explorerReducer },
  preloadedState: {
    explorer: {
      config: {
        // @ts-ignore
        filterConfig: {
          info: {
            foo: { label: 'Foo' },
            bar: { label: 'Bar' },
            baz: { label: 'Baz' },
            lorem: { label: 'Lorem' },
          },
        },
      },
    },
  },
});

/** @type {import('../types').SavedExplorerFilterSet[]} */
export const testFilterSets = [
  {
    name: 'Simple filter set',
    description: '',
    filter: {
      __combineMode: 'AND',
      __type: FILTER_TYPE.STANDARD,
      value: {
        foo: { __type: FILTER_TYPE.OPTION, selectedValues: ['x', 'y'] },
        bar: { __type: FILTER_TYPE.RANGE, lowerBound: 0, upperBound: 1 },
      },
    },
  },
  {
    name: 'Complex filter set',
    description: 'A filter set with complex filter.',
    filter: {
      __combineMode: 'OR',
      __type: FILTER_TYPE.STANDARD,
      value: {
        foo: { __type: FILTER_TYPE.OPTION, selectedValues: ['x', 'y'] },
        'lorem:ipsum': {
          __type: FILTER_TYPE.ANCHORED,
          value: {
            bar: { __type: FILTER_TYPE.RANGE, lowerBound: 0, upperBound: 1 },
            baz: {
              __type: FILTER_TYPE.OPTION,
              selectedValues: ['hello', 'world'],
            },
          },
        },
      },
    },
  },
];
