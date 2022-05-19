// @ts-nocheck
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import FilterDisplay from '@src/components/FilterDisplay';

const simpleFilter = {
  __combineMode: 'AND',
  foo: { selectedValues: ['x', 'y'] },
  bar: { lowerBound: 0, upperBound: 1 },
};

const complexFilter = {
  __combineMode: 'OR',
  foo: { selectedValues: ['x', 'y'] },
  'lorem:ipsum': {
    filter: {
      bar: { lowerBound: 0, upperBound: 1 },
      baz: { selectedValues: ['hello', 'world'] },
    },
  },
};

const filterInfo = {
  foo: { label: 'Foo' },
  bar: { label: 'Bar' },
  baz: { label: 'Baz' },
  lorem: { label: 'Lorem' },
};

storiesOf('FilterDisplay', module)
  .add('Simple', () => (
    <FilterDisplay filter={simpleFilter} filterInfo={filterInfo} />
  ))
  .add('Simple with action', () => (
    <>
      <div style={{ marginBottom: '1rem' }}>
        <p>
          Handle click <code>combineMode</code> and click <code>filter</code>:
        </p>
        <FilterDisplay
          filter={simpleFilter}
          filterInfo={filterInfo}
          onClickCombineMode={action('clickCombineMode')}
          onClickFilter={action('clickFilter')}
        />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <p>
          Handle click <code>combineMode</code> and close <code>filter</code>:
        </p>
        <FilterDisplay
          filter={simpleFilter}
          filterInfo={filterInfo}
          onClickCombineMode={action('clickCombineMode')}
          onCloseFilter={action('closeFilter')}
        />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <p>
          Handle click <code>combineMode</code> and click/close{' '}
          <code>filter</code>:
        </p>
        <FilterDisplay
          filter={simpleFilter}
          filterInfo={filterInfo}
          onClickCombineMode={action('clickCombineMode')}
          onClickFilter={action('clickFilter')}
          onCloseFilter={action('closeFilter')}
        />
      </div>
    </>
  ))
  .add('Complex', () => (
    <FilterDisplay filter={complexFilter} filterInfo={filterInfo} />
  ))
  .add('Complex with action', () => (
    <div>
      <p>
        Handle click <code>combineMode</code> and click/close{' '}
        <code>filter</code>:
      </p>
      <FilterDisplay
        filter={complexFilter}
        filterInfo={filterInfo}
        onClickCombineMode={action('clickCombineMode')}
        onClickFilter={action('clickFilter')}
        onCloseFilter={action('closeFilter')}
      />
    </div>
  ));
