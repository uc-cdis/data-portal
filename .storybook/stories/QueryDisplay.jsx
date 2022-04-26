// @ts-nocheck
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import QueryDisplay from '@src/components/QueryDisplay';

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

storiesOf('QueryDisplay', module)
  .add('Simple', () => (
    <QueryDisplay filter={simpleFilter} filterInfo={filterInfo} />
  ))
  .add('Simple with action', () => (
    <QueryDisplay
      filter={simpleFilter}
      filterInfo={filterInfo}
      onClickCombineMode={action('clickCombineMode')}
      onClickFilter={action('clickFilter')}
    />
  ))
  .add('Complex', () => (
    <QueryDisplay filter={complexFilter} filterInfo={filterInfo} />
  ))

  .add('Complex with action', () => (
    <QueryDisplay
      filter={complexFilter}
      filterInfo={filterInfo}
      onClickCombineMode={action('clickCombineMode')}
      onClickFilter={action('clickFilter')}
    />
  ));
