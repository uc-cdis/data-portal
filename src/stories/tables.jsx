import React from 'react';
import { storiesOf } from '@storybook/react';
import ArrangerWrapper from '../Arranger/ArrangerWrapper';
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
