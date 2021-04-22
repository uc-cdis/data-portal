import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import ConnectedFilter from '../../GuppyComponents/ConnectedFilter';
import GuppyWrapper from '../../GuppyComponents/GuppyWrapper';
import FilterGroup from '../../gen3-ui-component/components/filters/FilterGroup';
import FilterList from '../../gen3-ui-component/components/filters/FilterList';
import TableExample from './TableExample';
import './guppyWrapper.css';
import { filterConfig, guppyConfig, tableConfig } from './conf';

storiesOf('Guppy Wrapper', module).add('Connected Filter and Table', () => (
  <div className='guppy-wrapper'>
    <GuppyWrapper
      filterConfig={filterConfig}
      guppyConfig={guppyConfig}
      rawDataFields={tableConfig.map((e) => e.field)}
      onFilterChange={action('wrapper receive filter change')}
      onReceiveNewAggsData={action('wrapper receive aggs data')}
    >
      <ConnectedFilter
        className='guppy-wrapper__filter'
        filterConfig={filterConfig}
        guppyConfig={guppyConfig}
        filterComponents={{ FilterGroup, FilterList }}
      />
      <TableExample className='guppy-wrapper__table' />
    </GuppyWrapper>
  </div>
));
