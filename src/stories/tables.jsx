import React from 'react';
import { storiesOf } from '@storybook/react';
import '@arranger/components/public/themeStyles/beagle/beagle.css';
import ArrangerWrapper from '../components/ArrangerWrapper';
import DataExplorerTable from '../components/tables/DataExplorerTable/.';

storiesOf('Tables', module)
  .add('Data Explorer Table', () => (
    <ArrangerWrapper
      projectId={'search'}
      graphqlField={'subject'}
      index={''}
    >
      <DataExplorerTable />
    </ArrangerWrapper>
  ));
