import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { filterConfig, guppyConfig, fieldMapping } from './conf';
import ConnectedFilter from '../../GuppyComponents/ConnectedFilter';
import './guppyWrapper.css';

const sampleAggsData = {
  project_id: { histogram: [{ key: 'pcdc-20210325', count: 600 }] },
  race: {
    histogram: [
      { key: 'White', count: 439 },
      { key: 'Black or African American', count: 69 },
      { key: 'Unknown', count: 63 },
      { key: 'Not Reported', count: 19 },
      { key: 'Asian', count: 7 },
      { key: 'Native Hawaiian or Other Pacific Islander', count: 2 },
      { key: 'American Indian or Alaska Native', count: 1 },
    ],
  },
  ethnicity: {
    histogram: [
      { key: 'Not Hispanic or Latino', count: 434 },
      { key: 'Unknown', count: 112 },
      { key: 'Hispanic or Latino', count: 54 },
    ],
  },
  sex: {
    histogram: [
      { key: 'Male', count: 370 },
      { key: 'Female', count: 229 },
      { key: 'Unknown', count: 1 },
    ],
  },
};

storiesOf('ConnectedFilter', module).add('Filter', () => {
  const [filter, setFilter] = React.useState({});
  return (
    <ConnectedFilter
      filterConfig={filterConfig}
      guppyConfig={guppyConfig}
      onFilterChange={(value) => {
        setFilter(value);
        action('filter change');
      }}
      fieldMapping={fieldMapping}
      tierAccessLimit={guppyConfig.tierAccessLimit}
      filter={filter}
      initialTabsOptions={sampleAggsData}
      receivedAggsData={sampleAggsData}
    />
  );
});
