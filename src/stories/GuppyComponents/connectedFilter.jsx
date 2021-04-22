import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { filterConfig, guppyConfig, fieldMapping } from './conf';
import ConnectedFilter from '../../GuppyComponents/ConnectedFilter';
import FilterGroup from '../../gen3-ui-component/components/filters/FilterGroup';
import FilterList from '../../gen3-ui-component/components/filters/FilterList';
import './guppyWrapper.css';

storiesOf('ConnectedFilter', module).add('Filter', () => {
  const processFilterAggsData = (aggsData) => aggsData;
  return (
    <ConnectedFilter
      filterConfig={filterConfig}
      guppyConfig={guppyConfig}
      onFilterChange={action('filter change')}
      fieldMapping={fieldMapping}
      onProcessFilterAggsData={processFilterAggsData}
      tierAccessLimit={guppyConfig.tierAccessLimit}
      filterComponents={{ FilterGroup, FilterList }}
    />
  );
});
