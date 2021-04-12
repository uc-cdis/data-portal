import React, { useState } from 'react';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import SimpleInputField from '../../components/SimpleInputField';
import Button from '../../gen3-ui-component/components/Button';
import { stringifyFilters } from './utils';
import './ExplorerCohort.css';
import './typedef';

function CohortButton(props) {
  return <Button className='guppy-explorer-cohort__button' {...props} />;
}

/**
 * @param {{ labelIcon: IconProp; labelText: string; [x: string]: * }} prop
 */
export function CohortActionButton({ labelIcon, labelText, ...attrs }) {
  return (
    <CohortButton
      buttonType='default'
      label={
        <div>
          {labelText} {labelIcon && <FontAwesomeIcon icon={labelIcon} />}
        </div>
      }
      {...attrs}
    />
  );
}

/**
 * @param {Object} prop
 * @param {ExplorerCohort} prop.currentCohort
 * @param {ExplorerCohort[]} prop.cohorts
 * @param {(opened: ExplorerCohort) => void} prop.onAction
 * @param {() => void} prop.onClose
 */
function CohortOpenForm({ currentCohort, cohorts, onAction, onClose }) {
  const emptyOption = {
    label: 'Open New (no cohort)',
    value: { name: '', description: '', filters: {} },
  };
  const options = cohorts.map((cohort) => ({
    label: cohort.name,
    value: cohort,
  }));
  const [selected, setSelected] = useState({
    label: currentCohort.name || 'Open New (no cohort)',
    value: currentCohort,
  });
  return (
    <div className='guppy-explorer-cohort__form'>
      <h4>Select a saved Cohort to open</h4>
      <form onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}>
        <SimpleInputField
          label='Name'
          input={
            <Select
              options={[emptyOption, ...options]}
              value={selected}
              autoFocus
              clearable={false}
              theme={(theme) => ({
                ...theme,
                colors: {
                  ...theme.colors,
                  primary: 'var(--pcdc-color__primary)',
                },
              })}
              onChange={(e) => setSelected(e)}
            />
          }
        />
        <SimpleInputField
          label='Description'
          input={
            <textarea
              disabled
              placeholder='No description'
              value={selected.value.description}
            />
          }
        />
        <SimpleInputField
          label='Filters'
          input={
            <textarea
              disabled
              placeholder='No filters'
              value={stringifyFilters(selected.value.filters)}
            />
          }
        />
      </form>
      <div>
        <CohortButton
          buttonType='default'
          label='Back to page'
          onClick={onClose}
        />
        <CohortButton
          label='Open Cohort'
          onClick={() => onAction(selected.value)}
        />
      </div>
    </div>
  );
}

/**
 * @param {Object} prop
 * @param {ExplorerCohort} prop.currentCohort
 * @param {ExplorerFilters} prop.currentFilters
 * @param {ExplorerCohort[]} prop.cohorts
 * @param {boolean} prop.isFiltersChanged
 * @param {(saved: ExplorerCohort) => void} prop.onAction
 * @param {() => void} prop.onClose
 */
function CohortSaveForm({
  currentCohort,
  currentFilters,
  cohorts,
  isFiltersChanged,
  onAction,
  onClose,
}) {
  const [cohort, setCohort] = useState(currentCohort);
  const [error, setError] = useState({ isError: false, message: '' });
  function validate() {
    if (cohort.name === '')
      setError({ isError: true, message: 'Name is required!' });
    else if (cohorts.filter((c) => c.name === cohort.name).length > 0)
      setError({ isError: true, message: 'Name is already in use!' });
    else setError({ isError: false, message: '' });
  }
  return (
    <div className='guppy-explorer-cohort__form'>
      <h4>Save as a new Cohort</h4>
      {currentCohort.name !== '' && isFiltersChanged && (
        <p>
          <FontAwesomeIcon
            icon='exclamation-triangle'
            color='var(--pcdc-color__secondary)'
          />{' '}
          You have changed filters for this Cohort.
        </p>
      )}
      <form onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}>
        <SimpleInputField
          label='Name'
          input={
            <input
              autoFocus
              placeholder='Enter the cohort name'
              value={cohort.name}
              onBlur={validate}
              onChange={(e) => {
                e.persist();
                setCohort((prev) => ({ ...prev, name: e.target.value }));
              }}
            />
          }
          error={error}
        />
        <SimpleInputField
          label='Description'
          input={
            <textarea
              placeholder='Describe the cohort (optional)'
              value={cohort.description}
              onChange={(e) => {
                e.persist();
                setCohort((prev) => ({ ...prev, description: e.target.value }));
              }}
            />
          }
        />
        <SimpleInputField
          label='Filters'
          input={
            <textarea
              disabled
              placeholder='No filters'
              value={stringifyFilters(currentFilters)}
            />
          }
        />
      </form>
      <div>
        <CohortButton
          buttonType='default'
          label='Back to page'
          onClick={onClose}
        />
        <CohortButton
          enabled={cohort.name !== currentCohort.name && !error.isError}
          label='Save Cohort'
          onClick={() => onAction({ ...cohort, filters: currentFilters })}
        />
      </div>
    </div>
  );
}

/**
 * @param {Object} prop
 * @param {ExplorerCohort} prop.currentCohort
 * @param {ExplorerFilters} prop.currentFilters
 * @param {ExplorerCohort[]} prop.cohorts
 * @param {boolean} prop.isFiltersChanged
 * @param {(updated: ExplorerCohort) => void} prop.onAction
 * @param {() => void} prop.onClose
 */
function CohortUpdateForm({
  currentCohort,
  currentFilters,
  cohorts,
  isFiltersChanged,
  onAction,
  onClose,
}) {
  const [cohort, setCohort] = useState(currentCohort);
  const [error, setError] = useState({ isError: false, message: '' });
  function validate() {
    if (cohort.name === '')
      setError({ isError: true, message: 'Name is required!' });
    else if (
      cohorts.filter(
        (c) => c.name === cohort.name && c.name !== currentCohort.name
      ).length > 0
    )
      setError({ isError: true, message: 'Name is already in use!' });
    else setError({ isError: false, message: '' });
  }
  return (
    <div className='guppy-explorer-cohort__form'>
      <h4>Update the current Cohort</h4>
      {isFiltersChanged && (
        <p>
          <FontAwesomeIcon
            icon='exclamation-triangle'
            color='var(--pcdc-color__secondary)'
          />{' '}
          You have changed filters for this Cohort.
        </p>
      )}
      <form onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}>
        <SimpleInputField
          label='Name'
          input={
            <input
              autoFocus
              placeholder='Enter the cohort name'
              value={cohort.name}
              onBlur={validate}
              onChange={(e) => {
                e.persist();
                setCohort((prev) => ({ ...prev, name: e.target.value }));
              }}
            />
          }
          error={error}
        />
        <SimpleInputField
          label='Description'
          input={
            <textarea
              autoFocus
              placeholder='Describe the cohort (optional)'
              value={cohort.description}
              onChange={(e) => {
                e.persist();
                setCohort((prev) => ({ ...prev, description: e.target.value }));
              }}
            />
          }
        />
        <SimpleInputField
          label='Filters'
          input={
            <textarea
              disabled
              placeholder='No filters'
              value={stringifyFilters(cohort.filters)}
            />
          }
        />
        {isFiltersChanged && (
          <SimpleInputField
            label='Filters (changed)'
            input={
              <textarea
                disabled
                placeholder='No filters'
                value={stringifyFilters(currentFilters)}
              />
            }
          />
        )}
      </form>
      <div>
        <CohortButton
          buttonType='default'
          label='Back to page'
          onClick={onClose}
        />
        <CohortButton
          label='Update Cohort'
          enabled={
            (isFiltersChanged ||
              cohort.name !== currentCohort.name ||
              cohort.description !== currentCohort.description) &&
            !error.isError
          }
          onClick={() => onAction({ ...cohort, filters: currentFilters })}
        />
      </div>
    </div>
  );
}

/**
 * @param {Object} prop
 * @param {ExplorerCohort} prop.currentCohort
 * @param {(deleted: ExplorerCohort) => void} prop.onAction
 * @param {() => void} prop.onClose
 */
function CohortDeleteForm({ currentCohort, onAction, onClose }) {
  return (
    <div className='guppy-explorer-cohort__form'>
      <h4>Are you sure to delete the current Cohort?</h4>
      <div>
        <CohortButton
          buttonType='default'
          label='Back to page'
          onClick={onClose}
        />
        <CohortButton
          label='Delete Cohort'
          onClick={() => onAction(currentCohort)}
        />
      </div>
    </div>
  );
}

/**
 * @param {Object} prop
 * @param {ExplorerCohortActionType} prop.actionType
 * @param {ExplorerCohort} prop.currentCohort
 * @param {ExplorerFilters} prop.currentFilters
 * @param {ExplorerCohort[]} prop.cohorts
 * @param {object} prop.handlers
 * @param {(opened: ExplorerCohort) => void} prop.handlers.handleOpen
 * @param {(saved: ExplorerCohort) => void} prop.handlers.handleSave
 * @param {(updated: ExplorerCohort) => void} prop.handlers.handleUpdate
 * @param {(deleted: ExplorerCohort) => void} prop.handlers.handleDelete
 * @param {() => void} prop.handlers.handleClose
 * @param {boolean} prop.isFiltersChanged
 */
export function CohortActionForm({
  actionType,
  currentCohort,
  currentFilters,
  cohorts,
  handlers,
  isFiltersChanged,
}) {
  const {
    handleOpen,
    handleSave,
    handleUpdate,
    handleDelete,
    handleClose,
  } = handlers;

  switch (actionType) {
    case 'open':
      return (
        <CohortOpenForm
          currentCohort={currentCohort}
          cohorts={cohorts}
          onAction={handleOpen}
          onClose={handleClose}
        />
      );
    case 'save':
      return (
        <CohortSaveForm
          currentCohort={currentCohort}
          currentFilters={currentFilters}
          cohorts={cohorts}
          isFiltersChanged={isFiltersChanged}
          onAction={handleSave}
          onClose={handleClose}
        />
      );
    case 'update':
      return (
        <CohortUpdateForm
          currentCohort={currentCohort}
          currentFilters={currentFilters}
          cohorts={cohorts}
          isFiltersChanged={isFiltersChanged}
          onAction={handleUpdate}
          onClose={handleClose}
        />
      );
    case 'delete':
      return (
        <CohortDeleteForm
          currentCohort={currentCohort}
          onAction={handleDelete}
          onClose={handleClose}
        />
      );
  }
}
