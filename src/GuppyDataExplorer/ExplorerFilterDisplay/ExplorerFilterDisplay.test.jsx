import { configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import explorerReducer from '../../redux/explorer/slice';
import ExplorerFilterDisplay from './index';
import { FILTER_TYPE } from '../ExplorerFilterSetWorkspace/utils';

/** @typedef {import('../../redux/types').RootState} RootState */
/** @typedef {import('../../GuppyComponents/types').AnchoredFilterState} AnchoredFilterState */

const testFilterInfo = {
  foo: { label: 'Foo' },
  bar: { label: 'Bar' },
  baz: { label: 'Baz' },
  lorem: { label: 'Lorem' },
};

const testReduxStoreConfig = {
  reducer: { explorer: explorerReducer },
  preloadedState: {
    explorer:
      // @ts-ignore
      /** @type {RootState['explorer']} */ ({
        config: { filterConfig: { info: testFilterInfo } },
      }),
  },
};

test('renders with no filter value', () => {
  const store = configureStore(testReduxStoreConfig);

  const { queryByText, rerender } = render(
    <Provider store={store}>
      <ExplorerFilterDisplay filter={undefined} />
    </Provider>
  );
  expect(queryByText('No Filters')).toBeInTheDocument();

  rerender(
    <Provider store={store}>
      <ExplorerFilterDisplay filter={{}} />
    </Provider>
  );
  expect(queryByText('No Filters')).toBeInTheDocument();

  rerender(
    <Provider store={store}>
      <ExplorerFilterDisplay
        filter={{
          __type: FILTER_TYPE.STANDARD,
          __combineMode: 'AND',
          value: {},
        }}
      />
    </Provider>
  );
  expect(queryByText('No Filters')).toBeInTheDocument();
});

test('renders basic filter values', () => {
  const store = configureStore(testReduxStoreConfig);
  /** @type {RootState['explorer']['explorerFilter']} */
  const filter = {
    __type: FILTER_TYPE.STANDARD,
    __combineMode: 'AND',
    value: {
      foo: {
        __type: FILTER_TYPE.OPTION,
        selectedValues: ['x', 'y'],
      },
      bar: {
        __type: FILTER_TYPE.RANGE,
        lowerBound: 0,
        upperBound: 1,
      },
    },
  };

  const { queryByText, rerender } = render(
    <Provider store={store}>
      <ExplorerFilterDisplay filter={filter} />
    </Provider>
  );
  expect(queryByText('No Filters')).not.toBeInTheDocument();
  for (const field of Object.keys(filter.value))
    expect(queryByText(testFilterInfo[field].label)).toBeInTheDocument();

  const title = 'Test title';
  rerender(
    <Provider store={store}>
      <ExplorerFilterDisplay filter={filter} title={title} />
    </Provider>
  );
  expect(queryByText(title)).toBeInTheDocument();
});

test('renders anchored filter values', () => {
  const store = configureStore(testReduxStoreConfig);
  /** @type {RootState['explorer']['explorerFilter']} */
  const filter = {
    __type: FILTER_TYPE.STANDARD,
    __combineMode: 'AND',
    value: {
      'lorem:ipsum': {
        __type: FILTER_TYPE.ANCHORED,
        value: {
          foo: {
            __type: FILTER_TYPE.OPTION,
            selectedValues: ['x', 'y'],
          },
          bar: {
            __type: FILTER_TYPE.RANGE,
            lowerBound: 0,
            upperBound: 1,
          },
        },
      },
    },
  };

  const { queryByText } = render(
    <Provider store={store}>
      <ExplorerFilterDisplay filter={filter} />
    </Provider>
  );
  expect(queryByText('No Filters')).not.toBeInTheDocument();
  for (const field of Object.keys(filter.value)) {
    const [anchorField, anchorValue] = field.split(':');
    expect(queryByText(testFilterInfo[anchorField].label)).toBeInTheDocument();
    expect(queryByText(`"${anchorValue}"`)).toBeInTheDocument();

    const { value } = /** @type {AnchoredFilterState} */ (filter.value[field]);
    for (const _field of Object.keys(value))
      expect(queryByText(testFilterInfo[_field].label)).toBeInTheDocument();
  }
});
