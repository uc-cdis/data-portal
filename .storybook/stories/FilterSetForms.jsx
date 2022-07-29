import { configureStore } from '@reduxjs/toolkit';
import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import { Provider } from 'react-redux';
import { FILTER_TYPE } from '@src/GuppyComponents/Utils/const';
import FilterSetCreateForm from '@src/GuppyDataExplorer/ExplorerFilterSetForms/FilterSetCreateForm';
import FilterSetDeleteForm from '@src/GuppyDataExplorer/ExplorerFilterSetForms/FilterSetDeleteForm';
import FilterSetOpenForm from '@src/GuppyDataExplorer/ExplorerFilterSetForms/FilterSetOpenForm';
import FilterSetUpdateForm from '@src/GuppyDataExplorer/ExplorerFilterSetForms/FilterSetUpdateForm';
import explorerReducer from '@src/redux/explorer/slice';

/** @type {import('@src/GuppyDataExplorer/types').ExplorerFilterSet[]} */
const filterSets = [
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

const store = configureStore({
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

const style = {
  backgroundColor: 'white',
  border: '1px solid var(--g3-color__silver)',
  borderTop: '4px solid var(--pcdc-color__primary)',
  borderRadius: '4px',
  maxWidth: '480px',
  padding: '2rem 1rem',
};

function Wrapper({ children }) {
  return (
    <Provider store={store}>
      <div style={style}>{children}</div>
    </Provider>
  );
}

storiesOf('FilterSetForms', module)
  .add('Create form', () => (
    <Wrapper>
      <FilterSetCreateForm
        currentFilter={filterSets[0].filter}
        currentFilterSet={{
          name: '',
          description: '',
          filter: filterSets[0].filter,
        }}
        filterSets={filterSets}
        onAction={action('open')}
        onClose={action('close')}
        isFiltersChanged={false}
      />
    </Wrapper>
  ))
  .add('Delet form', () => (
    <Wrapper>
      <FilterSetDeleteForm
        currentFilterSet={filterSets[0]}
        onAction={action('delete')}
        onClose={action('close')}
      />
    </Wrapper>
  ))
  .add('Open form', () => (
    <Wrapper>
      <FilterSetOpenForm
        currentFilterSet={{ name: '', description: '', filter: {} }}
        filterSets={filterSets}
        onAction={action('open')}
        onClose={action('close')}
      />
    </Wrapper>
  ))
  .add('Update form', () => (
    <Wrapper>
      <FilterSetUpdateForm
        currentFilterSet={filterSets[0]}
        currentFilter={filterSets[0].filter}
        filterSets={filterSets}
        isFiltersChanged={false}
        onAction={action('open')}
        onClose={action('close')}
      />
    </Wrapper>
  ));
