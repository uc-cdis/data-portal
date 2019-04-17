import React from 'react';
import { storiesOf } from '@storybook/react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import DataExplorer from '../DataExplorer/.';
import GuppyDataExplorer from '../GuppyDataExplorer/GuppyDataExplorer';
import config from './explorerConfig';

storiesOf('Data Explorer', module)
  .add('Data Explorer', () => {
    library.add(faAngleDown, faAngleUp);
    return (
      <DataExplorer />
    );
  })
  .add('Guppy Data Explorer', () => {
    const guppyServerPath = 'http://localhost:3000';
    return (
      <GuppyDataExplorer
        nodeCountTitle={config.nodeCountTitle}
        chartConfig={config.charts}
        filterConfig={config.filters}
        tableConfig={config.table}
        guppyConfig={{
          path: guppyServerPath,
          ...config.guppyConfig,
        }}
        buttonConfig={{ buttons: config.buttons }}
        history={{}}
      />
    );
  });
