import { useSearchParams } from 'react-router-dom';
import Select from 'react-select';
import { explorerConfig } from '../../localconf';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { useExplorerById } from '../../redux/explorer/slice';
import { capitalizeFirstLetter, overrideSelectTheme } from '../../utils';
import './ExplorerSelect.css';

/** @type {{ label: string; value: string }[]} */
const explorerOptions = [];
for (const { guppyConfig, id, label } of explorerConfig)
  explorerOptions.push({
    label: capitalizeFirstLetter(label || guppyConfig.dataType),
    value: String(id),
  });

export default function ExplorerTabs() {
  const dispatch = useAppDispatch();
  const explorerId = useAppSelector((state) => state.explorer.explorerId);

  // eslint-disable-next-line no-unused-vars
  const [_, setSearchParams] = useSearchParams();
  function updateExplorerId(id) {
    dispatch(useExplorerById(id));
    setSearchParams(`id=${id}`);
  }

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
