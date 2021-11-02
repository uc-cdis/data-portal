import React from 'react';
import Select from 'react-select';
import { useExplorerConfig } from '../ExplorerConfigContext';
import { overrideSelectTheme } from '../../utils';
import './ExplorerSelect.css';

export default function ExplorerTabs() {
  const { explorerId, explorerOptions, updateExplorerId } = useExplorerConfig();
  const currentExplorer = explorerOptions.find(
    (o) => o.value === String(explorerId)
  );
  return explorerOptions.length > 1 ? (
    <div className='explorer-select'>
      <h4 className='explorer-select__title'>Explorers</h4>
      <div className='explorer-select__options-container'>
        <Select
          value={currentExplorer}
          isClearable={false}
          isSearchable={false}
          options={explorerOptions}
          theme={overrideSelectTheme}
          onChange={({ value }) => updateExplorerId(Number(value))}
        />
      </div>
    </div>
  ) : null;
}
