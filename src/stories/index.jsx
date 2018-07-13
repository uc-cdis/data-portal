import React from 'react';
import { storiesOf } from '@storybook/react';
import 'react-select/dist/react-select.css';
import '../css/base.less';
import '../css/graphiql.css';

import CountCard from '../components/cards/CountCard';
import DataSummaryCardGroup from '../components/cards/DataSummaryCardGroup';

const countItems = [
  {
    label: 'test1',
    value: 1,
  },
  {
    label: 'test2',
    value: 2,
  },
  {
    label: 'test3',
    value: 12342342,
  },
  {
    label: 'test4',
    value: 4,
  },
  {
    label: 'test5',
    value: 83,
  },
  {
    label: 'test6',
    value: 12342342,
  },
  {
    label: 'test7',
    value: 12342342,
  },
];

const countItems2 = [
  [
    {
      label: 'sub1',
      value: 1,
    },
    {
      label: 'sub2',
      value: 43,
    }
  ],
  {
    label: 'test2',
    value: 34,
  },
  {
    label: 'test3',
    value: 53,
  },
  {
    label: 'test4',
    value: 43124,
  },
  {
    label: 'test5',
    value: 87,
  },
];

storiesOf('Summaries', module)
  .add('CountCard', () => (
    <CountCard countItems={countItems} />
  ))
  .add('DataSummaryCardGroup', () => (
    <DataSummaryCardGroup summaryItems={countItems} connected={true} />
  ))
  .add('DataSummaryCardGroup with sub items', () => (
    <DataSummaryCardGroup summaryItems={countItems2} connected={true} />
  ))
