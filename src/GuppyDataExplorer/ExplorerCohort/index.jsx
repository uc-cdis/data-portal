import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import cloneDeep from 'lodash.clonedeep';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap_white.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CohortActionButton, CohortActionForm } from './CohortActionComponents';
import './ExplorerCohort.css';

function createEmptyCohort() {
  return {
    name: '',
    description: '',
    filter: {},
  };
}

function truncateWithEllipsis(string, maxLength) {
  return string.length > maxLength
    ? string.slice(0, maxLength - 3) + '...'
    : string;
}

function ExplorerCohort({ className, filter, onOpenCohort, onDeleteCohort }) {
  const [cohort, setCohort] = useState(createEmptyCohort());
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
    setCohort(cloneDeep(opened));
    onOpenCohort(cloneDeep(opened));
    closeActionForm();
  }
  function handleSave(saved) {
    console.log('Cohort action: save');
    setCohort(cloneDeep(saved));
    setCohorts([...cohorts, cloneDeep(saved)]);
    closeActionForm();
  }
  function handleUpdate(updated) {
    console.log('Cohort action: update');
    const updatedCohorts = [];
    for (const { name, description } of cohorts) {
      if (name === updated.name) updatedCohorts.push(cloneDeep(updated));
      else updatedCohorts.push({ name, description });
    }
    setCohort(cloneDeep(updated));
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
    setCohort(createEmptyCohort());
    setCohorts(updatedCohorts);
    onDeleteCohort(createEmptyCohort());
    closeActionForm();
  }

  const isFilterChanged =
    JSON.stringify(filter) !== JSON.stringify(cohort.filter);
  function FilterChangedWarning() {
    return (
      <Tooltip
        placement='top'
        overlay='You have changed filters for this Cohort. Click this icon to undo.'
        arrowContent={<div className='rc-tooltip-arrow-inner' />}
      >
        <FontAwesomeIcon
          icon='exclamation-triangle'
          color='#EF8523' // g3-color__highlight-orange
          size='xs'
          style={{
            cursor: 'pointer',
          }}
          onClick={() => onOpenCohort(cloneDeep(cohort))}
        />
      </Tooltip>
    );
  }

  return (
    <div className={className}>
      <div>
        <h1 className='guppy-explorer-cohort__name'>
          Cohort:{' '}
          {cohort.name ? (
            <>
              {truncateWithEllipsis(cohort.name, 30)}{' '}
              {isFilterChanged && <FilterChangedWarning />}
            </>
          ) : (
            <span className='guppy-explorer-cohort__placeholder'>untitled</span>
          )}
        </h1>
        <p>
          {cohort.description ? (
            truncateWithEllipsis(cohort.description, 80)
          ) : (
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
              isFilterChanged={isFilterChanged}
            />
          </div>,
          document.getElementById('root')
        )}
    </div>
  );
}

export default ExplorerCohort;
