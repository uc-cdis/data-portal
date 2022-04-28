import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash.clonedeep';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap_white.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SimplePopup from '../../components/SimplePopup';
import Button from '../../gen3-ui-component/components/Button';
import { useExplorerState } from '../ExplorerStateContext';
import { useExplorerFilterSets } from '../ExplorerFilterSetsContext';
import {
  FilterSetActionMenu,
  FilterSetActionForm,
} from './FilterSetActionComponents';
import { createEmptyFilterSet, truncateWithEllipsis } from './utils';
import './ExplorerFilterSet.css';

/** @typedef {import('./types').ExplorerFilter} ExplorerFilter */
/** @typedef {import('./types').ExplorerFilterSet} ExplorerFilterSet */
/** @typedef {import('./types').ExplorerFilterSetActionType} ExplorerFilterSetActionType */

/**
 * @param {Object} prop
 * @param {string} prop.className
 * @param {ExplorerFilter} prop.filter
 */
function ExplorerFilterSet({ className, filter }) {
  const { handleFilterChange, handleFilterClear } = useExplorerState();
  const [filterSet, setFilterSet] = useState(createEmptyFilterSet());

  const {
    filterSets,
    refreshFilterSets,
    createFilterSet,
    deleteFilterSet,
    updateFilterSet,
  } = useExplorerFilterSets();
  const [isError, setIsError] = useState(false);
  useEffect(() => {
    if (!isError) refreshFilterSets().catch(() => setIsError(true));
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
    handleFilterClear();
  }
  function handleOpen(/** @type {ExplorerFilterSet} */ opened) {
    setFilterSet(cloneDeep(opened));
    handleFilterChange(cloneDeep(opened.filter));
    closeActionForm();
  }
  async function handleCreate(/** @type {ExplorerFilterSet} */ created) {
    try {
      setFilterSet(await createFilterSet(created));
      await refreshFilterSets();
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
      await refreshFilterSets();
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
      await refreshFilterSets();
      handleFilterClear();
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
    JSON.stringify(filter) !== JSON.stringify(filterSet.filter);

  return (
    <div className={className}>
      {isError ? (
        <div className='explorer-filter-set__error'>
          <h2>Error obtaining saved Filter Set data...</h2>
          <p>
            Please retry by clicking {'"Retry"'} button or refreshing the page.
            <br />
            If the problem persists, please contact the administrator (
            <a href='mailto:pcdc_help@lists.uchicago.edu'>
              pcdc_help@lists.uchicago.edu
            </a>
            ) for more information.
          </p>
          <Button label='Retry' onClick={() => setIsError(false)} />
        </div>
      ) : (
        <>
          <div>
            <h4 className='explorer-filter-set__title'>
              My filter sets{' '}
              {filterSet.name && isFiltersChanged && (
                <Tooltip
                  overlay='You have changed filters for this Filter Set. Click this icon to undo.'
                  arrowContent={<div className='rc-tooltip-arrow-inner' />}
                  trigger={['hover', 'focus']}
                >
                  <span
                    onClick={() =>
                      handleFilterChange(cloneDeep(filterSet.filter))
                    }
                    onKeyPress={(e) => {
                      if (e.charCode === 13 || e.charCode === 32) {
                        e.preventDefault();
                        handleFilterChange(cloneDeep(filterSet.filter));
                      }
                    }}
                    role='button'
                    tabIndex={0}
                  >
                    <FontAwesomeIcon
                      icon='triangle-exclamation'
                      color='var(--pcdc-color__secondary)'
                      size='xs'
                      style={{
                        cursor: 'pointer',
                      }}
                    />
                  </span>
                </Tooltip>
              )}
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
            currentFilter={filter}
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
