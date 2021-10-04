import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash.clonedeep';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap_white.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SimplePopup from '../../components/SimplePopup';
import Button from '../../gen3-ui-component/components/Button';
import { CohortActionMenu, CohortActionForm } from './CohortActionComponents';
import {
  createEmptyCohort,
  truncateWithEllipsis,
  fetchCohorts,
  createCohort,
  updateCohort,
  deleteCohort,
} from './utils';
import './ExplorerCohort.css';
import './typedef';

/**
 * @param {Object} prop
 * @param {string} prop.className
 * @param {ExplorerFilters} prop.filter
 * @param {({ filters }: { filters: ExplorerFilters }) => void} prop.onOpenCohort
 * @param {({ filters }: { filters: ExplorerFilters }) => void} prop.onDeleteCohort
 */
function ExplorerCohort({ className, filter, onOpenCohort, onDeleteCohort }) {
  const [cohort, setCohort] = useState(createEmptyCohort());

  /** @type {ExplorerCohort[]} */
  const emptyCohorts = [];
  const [cohorts, setCohorts] = useState(emptyCohorts);
  const [isError, setIsError] = useState(false);
  useEffect(() => {
    let isMounted = true;
    if (!isError)
      fetchCohorts()
        .then((fetchedCohorts) => isMounted && setCohorts(fetchedCohorts))
        .catch(() => setIsError(true));

    return () => {
      isMounted = false;
    };
  }, [isError]);

  /** @type {[ExplorerCohortActionType, React.Dispatch<React.SetStateAction<ExplorerCohortActionType>>]} */
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
    const emptyCohort = createEmptyCohort();
    setCohort(emptyCohort);
    onOpenCohort(emptyCohort);
  }
  function handleOpen(/** @type {ExplorerCohort} */ opened) {
    setCohort(cloneDeep(opened));
    onOpenCohort(cloneDeep(opened));
    closeActionForm();
  }
  async function handleCreate(/** @type {ExplorerCohort} */ created) {
    try {
      setCohort(await createCohort(created));
      setCohorts(await fetchCohorts());
    } catch (e) {
      setIsError(true);
    } finally {
      closeActionForm();
    }
  }
  async function handleUpdate(/** @type {ExplorerCohort} */ updated) {
    try {
      await updateCohort(updated);
      setCohort(cloneDeep(updated));
      setCohorts(await fetchCohorts());
    } catch (e) {
      setIsError(true);
    } finally {
      closeActionForm();
    }
  }
  async function handleDelete(/** @type {ExplorerCohort} */ deleted) {
    try {
      await deleteCohort(deleted);
      setCohort(createEmptyCohort());
      setCohorts(await fetchCohorts());
      onDeleteCohort(createEmptyCohort());
    } catch (e) {
      setIsError(true);
    } finally {
      closeActionForm();
    }
  }
  /** @param {{ value: ExplorerCohortActionType}} e */
  function handleSelectAction({ value }) {
    if (value === 'new') {
      handleNew();
    } else {
      openActionForm(value);
    }
  }

  const isFiltersChanged =
    JSON.stringify(filter) !== JSON.stringify(cohort.filters);
  function FilterChangedWarning() {
    return (
      <Tooltip
        placement='top'
        overlay='You have changed filters for this Filter Set. Click this icon to undo.'
        arrowContent={<div className='rc-tooltip-arrow-inner' />}
        trigger={['hover', 'focus']}
      >
        <span
          onClick={() => onOpenCohort(cloneDeep(cohort))}
          onKeyPress={(e) => {
            if (e.charCode === 13 || e.charCode === 32) {
              e.preventDefault();
              onOpenCohort(cloneDeep(cohort));
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
        <div className='guppy-explorer-cohort__error'>
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
            <h1 className='guppy-explorer-cohort__name'>
              Filter Set:{' '}
              {cohort.name ? (
                <>
                  {truncateWithEllipsis(cohort.name, 30)}{' '}
                  {isFiltersChanged && <FilterChangedWarning />}
                </>
              ) : (
                <span className='guppy-explorer-cohort__placeholder'>
                  untitled
                </span>
              )}
            </h1>
            <p>
              {cohort.description ? (
                truncateWithEllipsis(cohort.description, 70)
              ) : (
                <span className='guppy-explorer-cohort__placeholder'>
                  No description
                </span>
              )}
            </p>
          </div>
          <CohortActionMenu
            isCohortEmpty={cohort.name === ''}
            hasNoSavedCohorts={cohorts.length === 0}
            onSelectAction={handleSelectAction}
          />
        </>
      )}
      {showActionForm && (
        <SimplePopup>
          <CohortActionForm
            actionType={actionType}
            currentCohort={cohort}
            currentFilters={filter}
            cohorts={cohorts}
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

ExplorerCohort.propTypes = {
  className: PropTypes.string,
  filter: PropTypes.object,
  onOpenCohort: PropTypes.func,
  onDeleteCohort: PropTypes.func,
};

export default ExplorerCohort;
