import React from 'react';
import Select from 'react-select';
import { useExplorerConfig } from '../ExplorerConfigContext';
import { overrideSelectTheme } from '../../utils';
import './ExplorerSelect.css';

export default function ExplorerTabs() {
  const { explorerId, explorerOptions, updateExplorerId } = useExplorerConfig();
  const selectExlorer = explorerOptions.find(
    (o) => o.value === String(explorerId)
  );
  return explorerOptions.length > 1 ? (
    <div className='explorer-select'>
      <div className='explorer-select__title'>
        <div>Explorer:</div> <h1>{selectExlorer.label}</h1>
      </div>
      <div className='explorer-select__options-container'>
        <Select
          value={{ label: 'Switch Explorer', value: '' }}
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
