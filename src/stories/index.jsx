import React from 'react';
import { storiesOf } from '@storybook/react';
import '@arranger/components/public/themeStyles/beagle/beagle.css';
import 'react-select/dist/react-select.css';
import '../css/base.less';
import '../css/graphiql.css';

import CountCard from '../components/CountCard';

const countItems = [
  {
    label: 'test1',
    value: '1',
  },
  {
    label: 'test2',
    value: '2',
  },
  {
    label: 'test3',
    value: '3',
  },
  {
    label: 'test4',
    value: '4',
  },
  {
    label: 'test5',
    value: '5',
  },
];

storiesOf('CountCard', module)
  .add('default', () => (
    <CountCard countItems={countItems} />
  ));
