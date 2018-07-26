import React from 'react';
import { storiesOf } from '@storybook/react';
import DataExplorer from '../DataExplorer/.';

storiesOf('Data Explorer', module)
  .add('Data Explorer', () => (
    <DataExplorer />
  ));
