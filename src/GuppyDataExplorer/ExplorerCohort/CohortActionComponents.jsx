import React, { useState } from 'react';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SimpleInputField from '../../components/SimpleInputField';
import Button from '../../gen3-ui-component/components/Button';
import './ExplorerCohort.css';

function CohortButton(props) {
  return <Button className='guppy-explorer-cohort__button' {...props} />;
}

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

function CohortOpenForm({ currentCohort, cohorts, onAction, onClose }) {
  const emptyOption = {
    label: 'Open New (no cohort)',
    value: { name: '', description: '', filter: {} },
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
      <form>
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
                  primary: 'var(--g3-color__base-blue)',
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

function CohortSaveForm({
  currentCohort,
  currentFilter,
  cohorts,
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
      <form>
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
          onClick={() => onAction({ ...cohort, filter: currentFilter })}
        />
      </div>
    </div>
  );
}

function CohortUpdateForm({ currentCohort, currentFilter, onAction, onClose }) {
  const [description, setDescription] = useState(currentCohort.description);
  return (
    <div className='guppy-explorer-cohort__form'>
      <h4>Update the current Cohort</h4>
      <form>
        <SimpleInputField
          label='Name'
          input={<input disabled value={currentCohort.name} />}
        />
        <SimpleInputField
          label='Description'
          input={
            <textarea
              autoFocus
              placeholder='Describe the cohort (optional)'
              value={description}
              onChange={(e) => {
                e.persist();
                setDescription(e.target.value);
              }}
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
          label='Update Cohort'
          enabled={description !== currentCohort.description}
          onClick={() =>
            onAction({
              ...currentCohort,
              description,
              filter: currentFilter,
            })
          }
        />
      </div>
    </div>
  );
}

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

export function CohortActionForm({
  actionType,
  currentCohort,
  currentFilter,
  cohorts,
  handlers,
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
          currentFilter={currentFilter}
          cohorts={cohorts}
          onAction={handleSave}
          onClose={handleClose}
        />
      );
    case 'update':
      return (
        <CohortUpdateForm
          currentCohort={currentCohort}
          currentFilter={currentFilter}
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
