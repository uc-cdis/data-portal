import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { CohortActionButton, CohortActionForm } from './CohortActionComponents';
import './ExplorerCohort.css';

function ExplorerCohort({ className, filter, onOpenCohort, onDeleteCohort }) {
  const [cohort, setCohort] = useState({
    name: '',
    description: '',
    filter: {},
  });
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
    onOpenCohort(opened);
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
    setCohort({ name: '', description: '', filter: {} });
    setCohorts(updatedCohorts);
    onDeleteCohort({ name: '', description: '', filter: {} });
    closeActionForm();
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
            <CohortActionForm
              actionType={actionType}
              currentCohort={cohort}
              currentFilter={filter}
              cohorts={cohorts}
              handlers={{
                handleOpen,
                handleSave,
                handleUpdate,
                handleDelete,
                handleClose: closeActionForm,
              }}
            />
          </div>,
          document.getElementById('root')
        )}
    </>
  );
}

export default ExplorerCohort;
