import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash.clonedeep';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap_white.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SimplePopup from '../../components/SimplePopup';
import Button from '../../gen3-ui-component/components/Button';
import { useExplorerState } from '../ExplorerStateContext';
import {
  FilterSetActionMenu,
  FilterSetActionForm,
} from './FilterSetActionComponents';
import {
  createEmptyFilterSet,
  truncateWithEllipsis,
  fetchFilterSets,
  createFilterSet,
  updateFilterSet,
  deleteFilterSet,
} from './utils';
import './ExplorerFilterSet.css';
import './typedef';

/**
 * @param {Object} prop
 * @param {string} prop.className
 * @param {ExplorerFilters} prop.filter
 */
function ExplorerFilterSet({ className, filter }) {
  const { clearFilters, updateFilters } = useExplorerState();
  const [filterSet, setFilterSet] = useState(createEmptyFilterSet());

  /** @type {ExplorerFilterSet[]} */
  const emptyFilterSets = [];
  const [filterSets, setFilterSets] = useState(emptyFilterSets);
  const [isError, setIsError] = useState(false);
  useEffect(() => {
    let isMounted = true;
    if (!isError)
      fetchFilterSets()
        .then(
          (fetchedFilterSets) => isMounted && setFilterSets(fetchedFilterSets)
        )
        .catch(() => setIsError(true));

    return () => {
      isMounted = false;
    };
  }, [isError]);

  /** @type {[ExplorerFilterSetActionType, React.Dispatch<React.SetStateAction<ExplorerFilterSetActionType>>]} */
  const [actionType, setActionType] = useState('open');
  const [showActionForm, setShowActionForm] = useState(false);
  function openActionForm(type) {
    setActionType(type);
    setShowActionForm(true);
  }
  function closeActionForm() {
    setShowActionForm(false);
  }

  function handleNew() {
    setFilterSet(createEmptyFilterSet());
    clearFilters();
  }
  function handleOpen(/** @type {ExplorerFilterSet} */ opened) {
    setFilterSet(cloneDeep(opened));
    updateFilters(cloneDeep(opened.filters));
    closeActionForm();
  }
  async function handleCreate(/** @type {ExplorerFilterSet} */ created) {
    try {
      setFilterSet(await createFilterSet(created));
      setFilterSets(await fetchFilterSets());
    } catch (e) {
      setIsError(true);
    } finally {
      closeActionForm();
    }
  }
  async function handleUpdate(/** @type {ExplorerFilterSet} */ updated) {
    try {
      await updateFilterSet(updated);
      setFilterSet(cloneDeep(updated));
      setFilterSets(await fetchFilterSets());
    } catch (e) {
      setIsError(true);
    } finally {
      closeActionForm();
    }
  }
  async function handleDelete(/** @type {ExplorerFilterSet} */ deleted) {
    try {
      await deleteFilterSet(deleted);
      setFilterSet(createEmptyFilterSet());
      setFilterSets(await fetchFilterSets());
      clearFilters();
    } catch (e) {
      setIsError(true);
    } finally {
      closeActionForm();
    }
  }
  /** @param {{ value: ExplorerFilterSetActionType}} e */
  function handleSelectAction({ value }) {
    if (value === 'new') {
      handleNew();
    } else {
      openActionForm(value);
    }
  }

  const isFiltersChanged =
    JSON.stringify(filter) !== JSON.stringify(filterSet.filters);
  function FilterChangedWarning() {
    return (
      <Tooltip
        overlay='You have changed filters for this Filter Set. Click this icon to undo.'
        arrowContent={<div className='rc-tooltip-arrow-inner' />}
        trigger={['hover', 'focus']}
      >
        <span
          onClick={() => updateFilters(cloneDeep(filterSet.filters))}
          onKeyPress={(e) => {
            if (e.charCode === 13 || e.charCode === 32) {
              e.preventDefault();
              updateFilters(cloneDeep(filterSet.filters));
            }
          }}
          role='button'
          tabIndex={0}
        >
          <FontAwesomeIcon
            icon='exclamation-triangle'
            color='var(--pcdc-color__secondary)'
            size='xs'
            style={{
              cursor: 'pointer',
            }}
          />
        </span>
      </Tooltip>
    );
  }

  return (
    <div className={className}>
      {isError ? (
        <div className='explorer-filter-set__error'>
          <h2>Error obtaining saved Filter Set data...</h2>
          <p>
            Please retry by clicking {'"Retry"'} button or refreshing the page.
            <br />
            If the problem persists, please contact administrator for more
            information.
          </p>
          <Button label='Retry' onClick={() => setIsError(false)} />
        </div>
      ) : (
        <>
          <div>
            <h4 className='explorer-filter-set__title'>
              My filter sets{' '}
              {filterSet.name && isFiltersChanged && <FilterChangedWarning />}
            </h4>
            <div className='explorer-filter-set__name'>
              {filterSet.name || (
                <span className='explorer-filter-set__placeholder'>
                  Untitled
                </span>
              )}
            </div>
            <p className='explorer-filter-set__description'>
              {filterSet.description ? (
                truncateWithEllipsis(filterSet.description, 80)
              ) : (
                <span className='explorer-filter-set__placeholder'>
                  No description
                </span>
              )}
            </p>
          </div>
          <FilterSetActionMenu
            isFilterSetEmpty={filterSet.name === ''}
            hasNoSavedFilterSets={filterSets.length === 0}
            onSelectAction={handleSelectAction}
          />
        </>
      )}
      {showActionForm && (
        <SimplePopup>
          <FilterSetActionForm
            actionType={actionType}
            currentFilterSet={filterSet}
            currentFilters={filter}
            filterSets={filterSets}
            handlers={{
              handleOpen,
              handleCreate,
              handleUpdate,
              handleDelete,
              handleClose: closeActionForm,
            }}
            isFiltersChanged={isFiltersChanged}
          />
        </SimplePopup>
      )}
    </div>
  );
}

ExplorerFilterSet.propTypes = {
  className: PropTypes.string,
  filter: PropTypes.object,
};

export default ExplorerFilterSet;
