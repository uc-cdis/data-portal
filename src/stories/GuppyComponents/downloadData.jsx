import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import ConnectedFilter from '../src/components/ConnectedFilter';
import GuppyWrapper from '../src/components/GuppyWrapper';
import TableExample from './TableExample';
import DownloadButtonExample from './DownloadButtonExample';
import './guppyWrapper.css';
import { filterConfig, guppyConfig, tableConfig } from './conf';

storiesOf('Guppy Wrapper', module)
  .add('Download Data', () => (
    <div className="guppy-wrapper">
      <GuppyWrapper
        filterConfig={filterConfig}
        guppyConfig={guppyConfig}
        rawDataFields={tableConfig.map((e) => e.field)}
        onFilterChange={action('wrapper receive filter change')}
        onReceiveNewAggsData={action('wrapper receive aggs data')}
      >
        <ConnectedFilter
          className="guppy-wrapper__filter"
          filterConfig={filterConfig}
          guppyConfig={guppyConfig}
        />
        <TableExample className="guppy-wrapper__table" />
        <DownloadButtonExample />
      </GuppyWrapper>
    </div>
  ));
