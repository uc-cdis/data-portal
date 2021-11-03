import React from 'react';
import { explorerConfig } from '../localconf';
import { ExplorerConfigProvider } from './ExplorerConfigContext';
import { ExplorerStateProvider } from './ExplorerStateContext';
import GuppyDataExplorer from './GuppyDataExplorer';

export default function Explorer() {
  return explorerConfig.length === 0 ? null : (
    <ExplorerConfigProvider>
      <ExplorerStateProvider>
        <GuppyDataExplorer />
      </ExplorerStateProvider>
    </ExplorerConfigProvider>
  );
}
