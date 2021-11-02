import React from 'react';
import { explorerConfig } from '../localconf';
import { ExplorerConfigProvider } from './ExplorerConfigContext';
import GuppyDataExplorer from './GuppyDataExplorer';

export default function Explorer() {
  return explorerConfig.length === 0 ? null : (
    <ExplorerConfigProvider>
      <GuppyDataExplorer />
    </ExplorerConfigProvider>
  );
}
