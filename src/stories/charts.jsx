import React from 'react';
import { storiesOf } from '@storybook/react';
import CustomPieChart from '../components/charts/CustomPieChart';

const payload = [
  { name: 'test1' },
  { name: 'test2' },
  { name: 'test3' },
];

storiesOf('CustomPieChart', module)
  .add('Active', () => (
    <CustomPieChart payload={payload} />
  ))
  .add('Not active', () => (
    <CustomPieChart payload={payload} active={false} />
  ));
