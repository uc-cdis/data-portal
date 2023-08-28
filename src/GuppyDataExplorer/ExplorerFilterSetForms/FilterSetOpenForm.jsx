import { useState } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import SimpleInputField from '../../components/SimpleInputField';
import Button from '../../gen3-ui-component/components/Button';
import { overrideSelectTheme } from '../../utils';
import ExplorerFilterDisplay from '../ExplorerFilterDisplay';
import './ExplorerFilterSetForms.css';

/** @typedef {import('../types').ExplorerFilterSet} ExplorerFilterSet */
/** @typedef {import('../types').SavedExplorerFilterSet} SavedExplorerFilterSet */

/** @type {{ saved: 'saved'; shared: 'shared' }} */
const FILTER_SET_SOURCE = {
  saved: 'saved',
  shared: 'shared',
};

/** @param {(token:string) => Promise<SavedExplorerFilterSet>} fetcher  */
function useSharedFilterSet(fetcher) {
  const [data, setData] = useState(/** @type {ExplorerFilterSet} */ (null));
  const [lastToken, setLastToken] = useState('');

  const initialStatus = /** @type {'idle' | 'error' | 'pending'} */ ('idle');
  const [status, setStatus] = useState(initialStatus);

  /** @param {string} token */
  function refresh(token) {
    if (token === lastToken) return;

    setData(null);
    setLastToken(token);
    setStatus('pending');

    fetcher(token)
      .then((newData) => {
        setData(newData);
        setStatus('idle');
      })
      .catch(() => setStatus('error'));
  }

  return {
    data,
    isError: status === 'error',
    isPending: status === 'pending',
    refresh,
  };
}

/**
 * @param {Object} prop
 * @param {ExplorerFilterSet} prop.currentFilterSet
 * @param {ExplorerFilterSet[]} prop.filterSets
 * @param {(token: string) => Promise<SavedExplorerFilterSet>} [prop.fetchWithToken]
 * @param {(opened: ExplorerFilterSet, isShared?: boolean) => void} prop.onAction
 * @param {() => void} prop.onClose
 */
function FilterSetOpenForm({
  currentFilterSet,
  filterSets,
  fetchWithToken,
  onAction,
  onClose,
}) {
  const initialSource = /** @type {keyof FILTER_SET_SOURCE} */ (
    FILTER_SET_SOURCE.saved
  );
  const [source, setSource] = useState(initialSource);

  // source: saved
  const options = filterSets.map((filterSet) => ({
    label: filterSet.name,
    value: filterSet,
  }));
  const [selected, setSelected] = useState({
    label: currentFilterSet.name,
    value: currentFilterSet,
  });

  // source: shared
  const [token, setToken] = useState('');
  const shared = useSharedFilterSet(fetchWithToken);
  function handleUseToken() {
    shared.refresh(token);
  }

  const isSourceSaved = source === FILTER_SET_SOURCE.saved;
  const isSourceShared = !isSourceSaved;
  const isActionEnabled = isSourceSaved
    ? selected.value.name !== ''
    : shared.data !== null;
  const value = isSourceSaved ? selected.value : shared.data;

  return (
    <div className='explorer-filter-set-form'>
      <h4>Select a saved Filter Set to open</h4>
      <form onSubmit={(e) => e.preventDefault()}>
        {fetchWithToken && 
          <SimpleInputField
            label='Source'
            input={
              <>
                <label style={{ display: 'block', textAlign: 'initial' }}>
                  <input
                    type='radio'
                    value={FILTER_SET_SOURCE.saved}
                    checked={source === FILTER_SET_SOURCE.saved}
                    onChange={() => setSource(FILTER_SET_SOURCE.saved)}
                    style={{ marginRight: '0.5rem' }}
                  />
                  Saved by me
                </label>
                <label style={{ display: 'block', textAlign: 'initial' }}>
                  <input
                    type='radio'
                    value={FILTER_SET_SOURCE.shared}
                    checked={source === FILTER_SET_SOURCE.shared}
                    onChange={() => setSource(FILTER_SET_SOURCE.shared)}
                    style={{ marginRight: '0.5rem' }}
                  />
                  Shared via token
                </label>
              </>
            }
          />
        }
        {isSourceSaved ? (
          <div style={{ height: '8rem' }}>
            <SimpleInputField
              label='Name'
              input={
                <Select
                  inputId='open-filter-set-name'
                  options={options}
                  value={selected}
                  isClearable={false}
                  theme={overrideSelectTheme}
                  onChange={(e) => setSelected(e)}
                />
              }
            />
            <SimpleInputField
              label='Description'
              input={
                <textarea
                  id='open-filter-set-description'
                  disabled
                  placeholder='No description'
                  value={selected.value.description}
                />
              }
            />
          </div>
        ) : (
          <>
            <div style={{ height: '4rem' }}>
              <SimpleInputField
                label='Token'
                input={
                  <input
                    id='open-filter-set-token'
                    type='text'
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                  />
                }
                error={{
                  isError: shared.isError,
                  message: 'Error: Check your token and try again.',
                }}
              />
            </div>
            <div style={{ height: '4rem', marginLeft: '1rem' }}>
              <Button
                buttonType='secondary'
                label='Use token'
                enabled={token !== '' && !shared.isPending}
                onClick={handleUseToken}
              />
            </div>
          </>
        )}
        <ExplorerFilterDisplay filter={value?.filter} />
      </form>
      <div>
        <Button buttonType='default' label='Back to page' onClick={onClose} />
        <Button
          label='Open Filter Set'
          enabled={isActionEnabled}
          onClick={() => onAction(value, isSourceShared)}
        />
      </div>
    </div>
  );
}

FilterSetOpenForm.propTypes = {
  currentFilterSet: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    filter: PropTypes.object,
    id: PropTypes.number,
  }),
  filterSets: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      description: PropTypes.string,
      filter: PropTypes.object,
      id: PropTypes.number,
    })
  ),
  fetchWithToken: PropTypes.func,
  onAction: PropTypes.func,
  onClose: PropTypes.func,
};

export default FilterSetOpenForm;
