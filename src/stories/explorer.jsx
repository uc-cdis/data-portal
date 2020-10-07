import React from 'react';
import { storiesOf } from '@storybook/react';
import GuppyDataExplorer from '../GuppyDataExplorer/GuppyDataExplorer';
import config from './explorerConfig';

storiesOf('Guppy Data Explorer', module)
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
