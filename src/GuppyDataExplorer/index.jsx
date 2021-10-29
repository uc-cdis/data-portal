import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import GuppyDataExplorer from './GuppyDataExplorer';
import { explorerConfig } from '../localconf';
import { ExplorerConfigProvider } from './ExplorerConfigContext';
import { capitalizeFirstLetter } from '../utils';
import './GuppyExplorer.css';
import './typedef';

export default function Explorer() {
  if (explorerConfig.length === 0) {
    return null;
  }
  const explorerIds = explorerConfig.map(({ id }) => id);
  const history = useHistory();

  const initialSearchParams = new URLSearchParams(history.location.search);
  const initialSearchParamId = initialSearchParams.has('id')
    ? Number(initialSearchParams.get('id'))
    : undefined;
  const initialExplorerId = explorerIds.includes(initialSearchParamId)
    ? initialSearchParamId
    : explorerIds[0];

  const [explorerId, setExporerId] = useState(initialExplorerId);
  function updateExplorerId(id) {
    setExporerId(id);
    history.push({ search: `id=${id}` });
  }

  const isMultiExplorer = explorerConfig.length > 1;

  return (
    <div className='guppy-explorer'>
      {isMultiExplorer && (
        <div className='guppy-explorer__tabs'>
          {explorerConfig.map(({ guppyConfig, id, label }) => (
            <div
              key={id}
              className={'guppy-explorer__tab'.concat(
                explorerId === id ? ' guppy-explorer__tab--selected' : ''
              )}
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
              <h3>{capitalizeFirstLetter(label || guppyConfig.dataType)}</h3>
            </div>
          ))}
        </div>
      )}
      <div className={isMultiExplorer ? 'guppy-explorer__main' : ''}>
        <ExplorerConfigProvider explorerId={explorerId}>
          <GuppyDataExplorer key={explorerId} />
        </ExplorerConfigProvider>
      </div>
    </div>
  );
}
