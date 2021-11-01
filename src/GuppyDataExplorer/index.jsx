import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import GuppyDataExplorer from './GuppyDataExplorer';
import { explorerConfig } from '../localconf';
import { ExplorerConfigProvider } from './ExplorerConfigContext';
import { capitalizeFirstLetter } from '../utils';
import './GuppyExplorer.css';
import './typedef';

function ExplorerTabs({ explorerId, explorerOptions, onChange }) {
  return explorerOptions.length > 1 ? (
    <div className='guppy-explorer__tabs'>
      {explorerOptions.map(({ id, label }) => (
        <div
          key={id}
          className={`guppy-explorer__tab ${
            explorerId === id ? ' guppy-explorer__tab--selected' : ''
          }`.trim()}
          onClick={() => onChange(id)}
          onKeyPress={(e) => {
            if (e.charCode === 13 || e.charCode === 32) {
              e.preventDefault();
              onChange(id);
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

ExplorerTabs.propTypes = {
  explorerId: PropTypes.number,
  explorerOptions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      label: PropTypes.string,
    })
  ),
  onChange: PropTypes.func,
};

export default function Explorer() {
  if (explorerConfig.length === 0) {
    return null;
  }
  const explorerIds = explorerConfig.map(({ id }) => id);
  const history = useHistory();

  const searchParams = new URLSearchParams(history.location.search);
  const searchParamId = searchParams.has('id')
    ? Number(searchParams.get('id'))
    : undefined;
  const isSearchParamIdValid = explorerIds.includes(searchParamId);
  const initialExplorerId = explorerIds.includes(searchParamId)
    ? searchParamId
    : explorerIds[0];
  useEffect(() => {
    if (!searchParams.has('id') || !isSearchParamIdValid)
      history.push({ search: `id=${initialExplorerId}` });
  }, []);

  const [explorerId, setExporerId] = useState(initialExplorerId);
  function updateExplorerId(id) {
    setExporerId(id);
    history.push({ search: `id=${id}` });
  }

  const explorerOptions = explorerConfig.map((e) => ({
    id: e.id,
    label: e.label || e.guppyConfig.dataType,
  }));

  return (
    <div className='guppy-explorer'>
      <ExplorerTabs
        explorerOptions={explorerOptions}
        explorerId={explorerId}
        onChange={updateExplorerId}
      />
      <div className={explorerOptions.length > 1 ? 'guppy-explorer__main' : ''}>
        <ExplorerConfigProvider explorerId={explorerId}>
          <GuppyDataExplorer key={explorerId} />
        </ExplorerConfigProvider>
      </div>
    </div>
  );
}
