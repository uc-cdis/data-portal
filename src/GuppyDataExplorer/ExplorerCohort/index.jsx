import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SimpleInputField from '../../components/SimpleInputField';
import Button from '../../gen3-ui-component/components/Button';
import './ExplorerCohort.css';

function CohortButton(props) {
  return <Button className='guppy-explorer-cohort__button' {...props} />;
}

function CohortOpenForm({ currentCohort, cohorts, onAction, onClose }) {
  const emptyOption = {
    label: 'Open New (no cohort)',
    value: { name: '', description: '' },
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
          input={<textarea disabled value={selected.value.description} />}
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

function CohortSaveForm({ currentCohort, onAction, onClose }) {
  const [cohort, setCohort] = useState(currentCohort);
  return (
    <div className='guppy-explorer-cohort__form'>
      <h4>Save as a new Cohort</h4>
      <form>
        <SimpleInputField
          label='Name'
          input={
            <input
              value={cohort.name}
              onChange={(e) => {
                e.persist();
                setCohort((prev) => ({ ...prev, name: e.target.value }));
              }}
            />
          }
        />
        <SimpleInputField
          label='Description'
          input={
            <textarea
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
        <CohortButton label='Save Cohort' onClick={() => onAction(cohort)} />
      </div>
    </div>
  );
}

function CohortUpdateForm({ currentCohort, onAction, onClose }) {
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
          onClick={() =>
            onAction({
              ...currentCohort,
              description,
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

function CohortActionButton({ labelIcon, labelText, ...attrs }) {
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

function ExplorerCohort({ className }) {
  const [cohort, setCohort] = useState({ name: '', descripton: '' });
  const [cohorts, setCohorts] = useState([]);

  const [actionType, setActionType] = useState('');
  const [showActionForm, setShowActionForm] = useState(false);
  function openActionForm(actionType) {
    setActionType(actionType);
    setShowActionForm(true);
  }
  function closeActionForm() {
    setShowActionForm(false);
  }

  function handleOpen(opened) {
    console.log('Cohort action: open');
    setCohort(opened);
    closeActionForm();
  }
  function handleSave(saved) {
    console.log('Cohort action: save');
    setCohort(saved);
    setCohorts([...cohorts, saved]);
    closeActionForm();
  }
  function handleUpdate(updated) {
    console.log('Cohort action: update');
    const updatedCohorts = [];
    for (const { name, description } of cohorts) {
      if (name === updated.name) updatedCohorts.push(updated);
      else updatedCohorts.push({ name, description });
    }
    setCohort(updated);
    setCohorts(updatedCohorts);
    closeActionForm();
  }
  function handleDelete(deleted) {
    console.log('Cohort action: delete');
    const updatedCohorts = [];
    for (const { name, description } of cohorts) {
      if (name === deleted.name) continue;
      else updatedCohorts.push({ name, description });
    }
    setCohort({ name: '', description: '' });
    setCohorts(updatedCohorts);
    closeActionForm();
  }

  function CohortActionForm() {
    switch (actionType) {
      case 'open':
        return (
          <CohortOpenForm
            currentCohort={cohort}
            cohorts={cohorts}
            onAction={handleOpen}
            onClose={closeActionForm}
          />
        );
      case 'save':
        return (
          <CohortSaveForm
            currentCohort={cohort}
            onAction={handleSave}
            onClose={closeActionForm}
          />
        );
      case 'update':
        return (
          <CohortUpdateForm
            currentCohort={cohort}
            onAction={handleUpdate}
            onClose={closeActionForm}
          />
        );
      case 'delete':
        return (
          <CohortDeleteForm
            currentCohort={cohort}
            onAction={handleDelete}
            onClose={closeActionForm}
          />
        );
    }
  }

  return (
    <>
      <div className={className}>
        <div>
          <h1 className='guppy-explorer-cohort__name'>
            Cohort:{' '}
            {cohort.name || (
              <span className='guppy-explorer-cohort__placeholder'>
                untitled
              </span>
            )}
          </h1>
          <p>
            {cohort.description || (
              <span className='guppy-explorer-cohort__placeholder'>
                No description
              </span>
            )}
          </p>
        </div>
        <div>
          <CohortActionButton
            labelIcon='folder-open'
            labelText='Open Cohort'
            enabled={cohorts.length > 0}
            onClick={() => openActionForm('open')}
          />
          <CohortActionButton
            labelIcon='save'
            labelText={`Save ${cohort.name === '' ? 'New' : 'As'}`}
            onClick={() => openActionForm('save')}
          />
          <CohortActionButton
            labelIcon='pen'
            labelText='Update Cohort'
            enabled={cohort.name !== ''}
            onClick={() => openActionForm('update')}
          />
          <CohortActionButton
            labelIcon='trash-alt'
            labelText='Delete Cohort'
            enabled={cohort.name !== ''}
            onClick={() => openActionForm('delete')}
          />
        </div>
      </div>
      {showActionForm &&
        ReactDOM.createPortal(
          <div className='guppy-explorer-cohort__overlay'>
            <CohortActionForm />
          </div>,
          document.getElementById('root')
        )}
    </>
  );
}

export default ExplorerCohort;
