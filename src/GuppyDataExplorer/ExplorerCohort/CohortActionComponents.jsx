import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SimpleInputField from '../../components/SimpleInputField';
import Button from '../../gen3-ui-component/components/Button';
import { overrideSelectTheme } from '../../utils';
import { stringifyFilters } from './utils';
import './ExplorerCohort.css';
import './typedef';

/**
 * @param {Object} prop
 * @param {boolean} prop.isCohortEmpty
 * @param {boolean} prop.hasNoSavedCohorts
 * @param {({ value: ExplorerCohortActionType }) => void} prop.onSelectAction
 */
export function CohortActionMenu({
  isCohortEmpty,
  hasNoSavedCohorts,
  onSelectAction,
}) {
  const options = [
    { label: 'New', value: 'new', isDisabled: isCohortEmpty },
    { label: 'Open', value: 'open', isDisabled: hasNoSavedCohorts },
    { label: 'Save', value: 'save' },
    { label: 'Save As', value: 'save as', isDisabled: isCohortEmpty },
    { label: 'Delete', value: 'delete', isDisabled: isCohortEmpty },
  ];
  return (
    <Select
      className='guppy-explorer-cohort__menu'
      value={{ label: 'Manage Cohorts', value: '' }}
      options={options}
      theme={overrideSelectTheme}
      onChange={onSelectAction}
    />
  );
}

CohortActionMenu.propTypes = {
  isCohortEmpty: PropTypes.bool,
  hasNoSavedCohorts: PropTypes.bool,
  onSelectAction: PropTypes.func,
};

function CohortButton(props) {
  return <Button className='guppy-explorer-cohort__button' {...props} />;
}

/**
 * @param {Object} prop
 * @param {ExplorerCohort} prop.currentCohort
 * @param {ExplorerCohort[]} prop.cohorts
 * @param {(opened: ExplorerCohort) => void} prop.onAction
 * @param {() => void} prop.onClose
 */
function CohortOpenForm({ currentCohort, cohorts, onAction, onClose }) {
  const options = cohorts.map((cohort) => ({
    label: cohort.name,
    value: cohort,
  }));
  const [selected, setSelected] = useState({
    label: currentCohort.name,
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
              options={options}
              value={selected}
              autoFocus
              clearable={false}
              theme={overrideSelectTheme}
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
          enabled={selected.value.name !== ''}
          onClick={() => onAction(selected.value)}
        />
      </div>
    </div>
  );
}

CohortOpenForm.propTypes = {
  currentCohort: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    filters: PropTypes.object,
    id: PropTypes.number,
  }),
  cohorts: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      description: PropTypes.string,
      filters: PropTypes.object,
      id: PropTypes.number,
    })
  ),
  onAction: PropTypes.func,
  onClose: PropTypes.func,
};

/**
 * @param {Object} prop
 * @param {ExplorerCohort} prop.currentCohort
 * @param {ExplorerFilters} prop.currentFilters
 * @param {ExplorerCohort[]} prop.cohorts
 * @param {boolean} prop.isFiltersChanged
 * @param {(created: ExplorerCohort) => void} prop.onAction
 * @param {() => void} prop.onClose
 */
function CohortCreateForm({
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

CohortCreateForm.propTypes = {
  currentCohort: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    filters: PropTypes.object,
    id: PropTypes.number,
  }),
  currentFilters: PropTypes.object,
  cohorts: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      description: PropTypes.string,
      filters: PropTypes.object,
      id: PropTypes.number,
    })
  ),
  isFiltersChanged: PropTypes.bool,
  onAction: PropTypes.func,
  onClose: PropTypes.func,
};

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
      <h4>Save changes to the current Cohort</h4>
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
          label='Save changes'
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

CohortUpdateForm.propTypes = {
  currentCohort: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    filters: PropTypes.object,
    id: PropTypes.number,
  }),
  currentFilters: PropTypes.object,
  cohorts: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      description: PropTypes.string,
      filters: PropTypes.object,
      id: PropTypes.number,
    })
  ),
  isFiltersChanged: PropTypes.bool,
  onAction: PropTypes.func,
  onClose: PropTypes.func,
};

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

CohortDeleteForm.propTypes = {
  currentCohort: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    filters: PropTypes.object,
    id: PropTypes.number,
  }),
  onAction: PropTypes.func,
  onClose: PropTypes.func,
};

/**
 * @param {Object} prop
 * @param {ExplorerCohortActionType} prop.actionType
 * @param {ExplorerCohort} prop.currentCohort
 * @param {ExplorerFilters} prop.currentFilters
 * @param {ExplorerCohort[]} prop.cohorts
 * @param {object} prop.handlers
 * @param {(opened: ExplorerCohort) => void} prop.handlers.handleOpen
 * @param {(created: ExplorerCohort) => void} prop.handlers.handleCreate
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
    handleCreate,
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
      return currentCohort.name === '' ? (
        <CohortCreateForm
          currentCohort={currentCohort}
          currentFilters={currentFilters}
          cohorts={cohorts}
          isFiltersChanged={isFiltersChanged}
          onAction={handleCreate}
          onClose={handleClose}
        />
      ) : (
        <CohortUpdateForm
          currentCohort={currentCohort}
          currentFilters={currentFilters}
          cohorts={cohorts}
          isFiltersChanged={isFiltersChanged}
          onAction={handleUpdate}
          onClose={handleClose}
        />
      );
    case 'save as':
      return (
        <CohortCreateForm
          currentCohort={currentCohort}
          currentFilters={currentFilters}
          cohorts={cohorts}
          isFiltersChanged={isFiltersChanged}
          onAction={handleCreate}
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
    default:
      return null;
  }
}

CohortActionForm.propTypes = {
  actionType: PropTypes.oneOf(['new', 'open', 'save', 'save as', 'delete']),
  currentCohort: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    filters: PropTypes.object,
    id: PropTypes.number,
  }),
  currentFilters: PropTypes.object,
  cohorts: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      description: PropTypes.string,
      filters: PropTypes.object,
      id: PropTypes.number,
    })
  ),
  handlers: PropTypes.shape({
    handleOpen: PropTypes.func,
    handleCreate: PropTypes.func,
    handleUpdate: PropTypes.func,
    handleDelete: PropTypes.func,
    handleClose: PropTypes.func,
  }),
  isFiltersChanged: PropTypes.bool,
};
