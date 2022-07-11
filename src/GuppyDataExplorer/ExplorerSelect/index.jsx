import Select from 'react-select';
import { explorerConfig } from '../../localconf';
import { capitalizeFirstLetter, overrideSelectTheme } from '../../utils';
import { useExplorerConfig } from '../ExplorerConfigContext';
import './ExplorerSelect.css';

/** @type {{ label: string; value: string }[]} */
const explorerOptions = [];
for (const { guppyConfig, id, label } of explorerConfig)
  explorerOptions.push({
    label: capitalizeFirstLetter(label || guppyConfig.dataType),
    value: String(id),
  });

export default function ExplorerTabs() {
  const { explorerId, updateExplorerId } = useExplorerConfig();
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
