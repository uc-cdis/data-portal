import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import FilterDisplay from '../../components/FilterDisplay';
import SimplePopup from '../../components/SimplePopup';
import ButtonToggle from '../../gen3-ui-component/components/ButtonToggle';
import { contactEmail } from '../../localconf';
import {
  createFilterSet,
  deleteFilterSet,
  fetchFilterSets,
  updateFilterSet,
} from '../../redux/explorer/asyncThunks';
import {
  createToken,
  fetchWithToken,
} from '../../redux/explorer/filterSetsAPI';
import { updateExplorerFilter } from '../../redux/explorer/slice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import FilterSetActionForm from './FilterSetActionForm';
import FilterSetLabel from './FilterSetLabel';
import useFilterSetWorkspace from './useFilterSetWorkspace';
import {
  checkIfFilterEmpty,
  dereferenceFilter,
  FILTER_TYPE,
  pluckFromAnchorFilter,
  pluckFromFilter,
} from './utils';
import './ExplorerFilterSetWorkspace.css';

/** @typedef {import('../types').SavedExplorerFilterSet} SavedExplorerFilterSet */
/** @typedef {import('./FilterSetActionForm').ActionFormType} ActionFormType */

function ExplorerFilterSetWorkspace() {
  const dispatch = useAppDispatch();
  /** @param {import('../types').ExplorerFilter} filter */
  function handleFilterChange(filter) {
    dispatch(updateExplorerFilter(filter));
  }
  const filterInfo = useAppSelector(
    (state) => state.explorer.config.filterConfig.info
  );
  const savedFilterSets = useAppSelector(
    (state) => state.explorer.savedFilterSets
  );
  const workspace = useFilterSetWorkspace();
  const activeFilterSet = workspace.all[workspace.activeId];
  const activeSavedFilterSet = savedFilterSets.data.find(
    ({ id }) => id === activeFilterSet.id
  );

  const [actionFormType, setActionFormType] = useState(
    /** @type {ActionFormType} */ (undefined)
  );
  function closeActionForm() {
    setActionFormType(undefined);
  }

  function handleClear() {
    workspace.clear();
  }
  function handleClearAll() {
    workspace.clearAll();
    closeActionForm();
  }
  function handleCreate() {
    workspace.create();
  }
  /** @param {SavedExplorerFilterSet} deleted */
  async function handleDelete(deleted) {
    try {
      await dispatch(deleteFilterSet(deleted));
      workspace.remove();
    } finally {
      closeActionForm();
    }
  }
  function handleDuplicate() {
    workspace.duplicate();
  }
  /**
   * @param {SavedExplorerFilterSet} loaded
   * @param {boolean} [isShared]
   */
  function handleLoad(loaded, isShared = false) {
    if (isShared) {
      workspace.load({ filter: loaded.filter });
    } else {
      let newActiveId;

      for (const [id, filterSet] of Object.entries(workspace.all))
        if (filterSet.id === loaded.id) {
          newActiveId = id;
          break;
        }

      if (newActiveId) workspace.use(newActiveId);
      else workspace.load(loaded);
    }

    closeActionForm();
  }
  /** @param {SavedExplorerFilterSet} saved */
  async function handleSave(saved) {
    try {
      if (saved.id === undefined) await dispatch(createFilterSet(saved));
      else await dispatch(updateFilterSet(saved));
    } finally {
      closeActionForm();
    }
  }
  function handleShare() {
    return createToken(activeSavedFilterSet);
  }
  function handleReset() {
    handleFilterChange(activeSavedFilterSet.filter);
  }
  function handleRemove() {
    workspace.remove();
  }
  /** @param {string} id */
  function handleUse(id) {
    workspace.use(id);
  }

  /** @type {import('../../components/FilterDisplay').ClickCombineModeHandler} */
  function handleClickCombineMode(payload) {
    if (activeFilterSet.filter.__type !== FILTER_TYPE.STANDARD) return;

    handleFilterChange({
      ...activeFilterSet.filter,
      __combineMode: payload === 'AND' ? 'OR' : 'AND',
    });
  }
  /** @type {import('../../components/FilterDisplay').ClickFilterHandler} */
  function handleCloseFilter(payload) {
    if (activeFilterSet.filter.__type !== FILTER_TYPE.STANDARD) return;

    const { field, anchorField, anchorValue } = payload;
    const { filter } = activeFilterSet;
    if (anchorField !== undefined && anchorValue !== undefined) {
      const anchor = `${anchorField}:${anchorValue}`;
      handleFilterChange(pluckFromAnchorFilter({ anchor, field, filter }));
    } else {
      handleFilterChange(pluckFromFilter({ field, filter }));
    }
  }

  const disableNew = Object.values(workspace.all).some(({ filter }) =>
    checkIfFilterEmpty(filter ?? {})
  );

  const defaultComposeState = {
    isActive: false,
    combineMode: /** @type {'AND' | 'OR'} */ ('AND'),
    value: [],
  };
  const [composeState, setComposeState] = useState(defaultComposeState);
  function handleCompose() {
    workspace.load({
      filter: {
        __type: FILTER_TYPE.COMPOSED,
        __combineMode: composeState.combineMode,
        refIds: composeState.value.map(({ value }) => value.id),
        value: composeState.value,
      },
    });

    setComposeState(defaultComposeState);
  }
  function toggleComposeState() {
    if (composeState.isActive) setComposeState(defaultComposeState);
    else setComposeState({ ...defaultComposeState, isActive: true });
  }
  /** @param {{ checked: boolean; id: string; label: string }} args */
  function toggleFilterToCompose({ checked, id, label }) {
    const newValue = [...composeState.value];

    if (checked) {
      newValue.push({ __type: 'REF', value: { id, label } });
    } else {
      const removeIndex = newValue.findIndex(({ value }) => value.id === id);
      newValue.splice(removeIndex, 1);
    }

    setComposeState((prev) => ({ ...prev, value: newValue }));
  }
  /** @param {'AND' | 'OR'} combineMode */
  function updateComposeCombineMode(combineMode) {
    setComposeState((prev) => ({ ...prev, combineMode }));
  }

  let nonEmptyFilterCount = Object.values(workspace.all).length;
  for (const { filter } of Object.values(workspace.all))
    if (checkIfFilterEmpty(filter)) nonEmptyFilterCount -= 1;
  const disableCompose = nonEmptyFilterCount < 2;

  return (
    <div className='explorer-filter-set-workspace'>
      <header>
        <h2>Filter Set Workspace</h2>
        {/* eslint-disable-next-line no-nested-ternary */}
        {savedFilterSets.isError ? (
          <div className='explorer-filter-set-workspace__error'>
            <p>
              <FontAwesomeIcon
                className='screen-size-warning__icon'
                icon='triangle-exclamation'
                color='var(--pcdc-color__secondary)'
              />
              Error obtaining saved Filter Set data...
              <button
                className='explorer-filter-set-workspace__action-button'
                type='button'
                onClick={() =>
                  dispatch(fetchFilterSets()).unwrap().catch(console.error)
                }
              >
                Retry
              </button>
            </p>
            <p>
              If the problem persists, please contact the administrator (
              <a href={contactEmail}>{contactEmail}</a>) for more information.
            </p>
          </div>
        ) : composeState.isActive ? (
          <div className='explorer-filter-set-workspace__action-button-group'>
            <span
              className='explorer-filter__combine-mode'
              style={{ display: 'inline-flex', margin: '0 1rem 0 0' }}
            >
              Compose with
              <ButtonToggle 
                isOn={composeState.combineMode === 'AND'}
                onText='AND'
                offText='OR'
                onToggle={({ value }) => updateComposeCombineMode(value)}
              />
            </span>
            <button
              className='explorer-filter-set-workspace__action-button'
              type='button'
              onClick={toggleComposeState}
            >
              Back
            </button>
            <button
              className='explorer-filter-set-workspace__action-button'
              type='button'
              onClick={handleCompose}
              disabled={composeState.value.length < 2}
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className='explorer-filter-set-workspace__action-button-group'>
              <button
                className='explorer-filter-set-workspace__action-button'
                type='button'
                onClick={handleCreate}
                disabled={disableNew}
                title={
                  disableNew
                    ? 'No new query if queries without filter exist'
                    : undefined
                }
              >
                New
              </button>
              <button
                className='explorer-filter-set-workspace__action-button'
                type='button'
                onClick={toggleComposeState}
                disabled={disableCompose}
              >
                Compose
              </button>
              <button
                className='explorer-filter-set-workspace__action-button'
                type='button'
                onClick={handleDuplicate}
                disabled={checkIfFilterEmpty(activeFilterSet?.filter ?? {})}
              >
                Duplicate
              </button>
              <button
                className='explorer-filter-set-workspace__action-button'
                type='button'
                onClick={handleRemove}
                disabled={workspace.size < 2}
              >
                Remove
              </button>
              <button
                className='explorer-filter-set-workspace__action-button'
                type='button'
                onClick={handleClear}
                disabled={checkIfFilterEmpty(activeFilterSet?.filter ?? {})}
              >
                Clear
              </button>
              <button
                className='explorer-filter-set-workspace__action-button'
                type='button'
                onClick={() => setActionFormType('CLEAR-ALL')}
                disabled={Object.keys(workspace.all).length < 2}
              >
                Remove all
              </button>
            </div>
            <div className='explorer-filter-set-workspace__action-button-group'>
              <button
                className='explorer-filter-set-workspace__action-button'
                type='button'
                onClick={() => setActionFormType('LOAD')}
              >
                Load
              </button>
              <button
                className='explorer-filter-set-workspace__action-button'
                type='button'
                onClick={() => setActionFormType('SAVE')}
                disabled={checkIfFilterEmpty(activeFilterSet?.filter ?? {})}
              >
                Save
              </button>
              <button
                className='explorer-filter-set-workspace__action-button'
                type='button'
                onClick={() => setActionFormType('SHARE')}
                disabled={activeSavedFilterSet === undefined}
              >
                Share
              </button>
              <button
                className='explorer-filter-set-workspace__action-button'
                type='button'
                onClick={handleReset}
                disabled={
                  activeSavedFilterSet === undefined ||
                  JSON.stringify(activeSavedFilterSet.filter) ===
                    JSON.stringify(activeFilterSet.filter)
                }
              >
                Reset
              </button>
              <button
                className='explorer-filter-set-workspace__action-button'
                type='button'
                onClick={() => setActionFormType('DELETE')}
                disabled={!('id' in (workspace.all[workspace.activeId] ?? {}))}
              >
                Delete
              </button>
            </div>
          </>
        )}
      </header>
      <main>
        {Object.keys(workspace.all).map((id, i) => {
          const filterSet = workspace.all[id];
          const isFilterEmpty = checkIfFilterEmpty(filterSet.filter);
          const filterSetCheckbox = (
            <input
              disabled={isFilterEmpty}
              type='checkbox'
              style={{ margin: '0 4px' }}
              onChange={({ target: { checked } }) => {
                const label = filterSet.name ?? `#${i + 1}`;
                toggleFilterToCompose({ checked, id, label });
              }}
            />
          );
          return workspace.activeId === id ? (
            <div
              className='explorer-filter-set-workspace__query explorer-filter-set-workspace__query--active'
              key={id}
            >
              <header>
                {composeState.isActive ? filterSetCheckbox : null}
                <button
                  className='explorer-filter-set-workspace__action-button'
                  type='button'
                  disabled
                >
                  Active
                </button>
                <FilterSetLabel filterSet={filterSet} index={i + 1} />
              </header>
              <main>
                {isFilterEmpty ? (
                  <h4>Try Filters to explore data</h4>
                ) : (
                  <FilterDisplay
                    filter={filterSet.filter}
                    filterInfo={filterInfo}
                    onClickCombineMode={handleClickCombineMode}
                    onCloseFilter={handleCloseFilter}
                  />
                )}
              </main>
            </div>
          ) : (
            <div className='explorer-filter-set-workspace__query' key={id}>
              <header>
                {composeState.isActive ? filterSetCheckbox : null}
                <button
                  className='explorer-filter-set-workspace__action-button'
                  type='button'
                  onClick={() => handleUse(id)}
                >
                  Use
                </button>
                <FilterSetLabel filterSet={filterSet} index={i + 1} />
              </header>
              <main>
                {isFilterEmpty ? (
                  <h4>Try Filters to explore data</h4>
                ) : (
                  <FilterDisplay
                    filter={filterSet.filter}
                    filterInfo={filterInfo}
                  />
                )}
              </main>
            </div>
          );
        })}
      </main>
      {actionFormType !== undefined && (
        <SimplePopup>
          <FilterSetActionForm
            currentFilter={
              dereferenceFilter(activeFilterSet?.filter, workspace) ?? {}
            }
            filterSets={{
              active: activeSavedFilterSet,
              all: savedFilterSets.data,
              empty: { name: '', description: '', filter: {} },
            }}
            fetchWithToken={fetchWithToken}
            handlers={{
              clearAll: handleClearAll,
              close: closeActionForm,
              delete: handleDelete,
              load: handleLoad,
              save: handleSave,
              share: handleShare,
            }}
            type={actionFormType}
          />
        </SimplePopup>
      )}
    </div>
  );
}

export default ExplorerFilterSetWorkspace;
