import React from 'react';
import GuppyDataExplorer from './GuppyDataExplorer';
import { explorerConfig } from '../localconf';
import {
  ExplorerConfigProvider,
  useExplorerConfig,
} from './ExplorerConfigContext';
import { capitalizeFirstLetter } from '../utils';
import './GuppyExplorer.css';
import './typedef';

function ExplorerTabs() {
  const { explorerId, explorerOptions, updateExplorerId } = useExplorerConfig();
  return explorerOptions.length > 1 ? (
    <div className='guppy-explorer__tabs'>
      {explorerOptions.map(({ id, label }) => (
        <div
          key={id}
          className={`guppy-explorer__tab ${
            explorerId === id ? ' guppy-explorer__tab--selected' : ''
          }`.trim()}
          onClick={() => updateExplorerId(id)}
          onKeyPress={(e) => {
            if (e.charCode === 13 || e.charCode === 32) {
              e.preventDefault();
              updateExplorerId(id);
            }
          }}
          role='button'
          tabIndex={0}
        >
          <h3>{capitalizeFirstLetter(label)}</h3>
        </div>
      ))}
    </div>
  ) : null;
}

export default function Explorer() {
  if (explorerConfig.length === 0) {
    return null;
  }

  return (
    <ExplorerConfigProvider>
      <ExplorerTabs />
      <GuppyDataExplorer />
    </ExplorerConfigProvider>
  );
}
