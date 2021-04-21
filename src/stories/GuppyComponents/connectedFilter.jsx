import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { filterConfig, guppyConfig, fieldMapping } from './conf';
import ConnectedFilter from '../src/components/ConnectedFilter';
import AccessibleFilter from '../src/components/ConnectedFilter/AccessibleFilter';
import UnaccessibleFilter from '../src/components/ConnectedFilter/UnaccessibleFilter';
import SwitchableFilterExample from './SwitchableFilterExample';
import './guppyWrapper.css';

storiesOf('ConnectedFilter', module)
  .add('Filter', () => {
    const processFilterAggsData = (aggsData) => aggsData;
    return (
      <ConnectedFilter
        filterConfig={filterConfig}
        guppyConfig={guppyConfig}
        onFilterChange={action('filter change')}
        fieldMapping={fieldMapping}
        onProcessFilterAggsData={processFilterAggsData}
        tierAccessLimit={guppyConfig.tierAccessLimit}
      />
    );
  })
  .add('Accessible Filter', () => {
    const processFilterAggsData = (aggsData) => aggsData;
    return (
      <AccessibleFilter
        filterConfig={filterConfig}
        guppyConfig={guppyConfig}
        onFilterChange={action('filter change')}
        fieldMapping={fieldMapping}
        onProcessFilterAggsData={processFilterAggsData}
        tierAccessLimit={guppyConfig.tierAccessLimit}
      />
    );
  })
  .add('Unaccessible Filter', () => {
    const processFilterAggsData = (aggsData) => aggsData;
    return (
      <UnaccessibleFilter
        filterConfig={filterConfig}
        guppyConfig={guppyConfig}
        onFilterChange={action('filter change')}
        fieldMapping={fieldMapping}
        onProcessFilterAggsData={processFilterAggsData}
        tierAccessLimit={guppyConfig.tierAccessLimit}
      />
    );
  })
  .add('SwitchableFilterExample', () => (
    <SwitchableFilterExample />
  ));
