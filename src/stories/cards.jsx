import React from 'react';
import { storiesOf } from '@storybook/react';
import DataSummaryCardGroup from '../components/cards/DataSummaryCardGroup';

const countItems0 = [
  {
    label: 'Cases',
    value: 12,
  },
  {
    label: 'Experiments',
    value: 42,
  },
  {
    label: 'Aliquots',
    value: 984,
  },
  {
    label: 'Files',
    value: 82973,
  },
];

const countItems1 = [
  {
    label: 'Cases',
    value: 12,
  },
  {
    label: 'Experiments',
    value: 42,
  },
  {
    label: 'Aliquots',
    value: 984,
  },
  {
    label: 'Files',
    value: 82973,
  },
];

const countItems2 = [
  [
    {
      label: 'Project',
      value: 9,
    },
    {
      label: 'Study',
      value: 11,
    },
  ],
  {
    label: 'Subject',
    value: 13463,
  },
  {
    label: 'Sample',
    value: 2354,
  },
  {
    label: 'Aliquots',
    value: 374225,
  },
  {
    label: 'Data File',
    value: 574356,
  },
];

storiesOf('Cards', module)
  .add('DataSummaryCardGroup', () => (
    <DataSummaryCardGroup summaryItems={countItems0} height={120} width={760} align='left' />
  ))
  .add('DataSummaryCardGroup connected', () => (
    <DataSummaryCardGroup summaryItems={countItems1} connected />
  ))
  .add('DataSummaryCardGroup with sub items', () => (
    <DataSummaryCardGroup summaryItems={countItems2} connected />
  ));
