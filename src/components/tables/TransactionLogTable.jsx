import React from 'react';
import PropTypes from 'prop-types';
import Table from './base/Table';
import Spinner from '../Spinner';
import { capitalizeFirstLetter, humanFileSize } from '../../utils.js';
import './TransactionLogTable.less';

/** @typedef {{ doc: string; doc_size: number; }} LogEntryDocument */

/** @typedef {'SUCCEEDED' | 'FAILED' | 'ERRORED' | 'PENDING'} LogEntryState */

/**
 * @typedef {Object} LogEntry
 * @property {string} id
 * @property {string} submitter
 * @property {string} project_id
 * @property {string} created_datetime
 * @property {LogEntryDocument[]} documents
 * @property {LogEntryState} state
 */

function getLocalTime(/** @type {string} */ gmtTimeString) {
  const date = new Date(gmtTimeString);
  const offsetMins = date.getTimezoneOffset();
  const offsetHous = -offsetMins / 60;
  return `${date.toLocaleString()} UTC${
    offsetMins > 0 ? '' : '+'
  }${offsetHous}`;
}

function getTotalFileSize(/** @type {LogEntryDocument[]} */ documents) {
  let totalSize = 0;
  if (documents)
    for (const { doc_size: docSize } of documents) totalSize += docSize || 0;

  return totalSize;
}

function stateToColor(/** @type {LogEntryState} */ state) {
  switch (state) {
    case 'SUCCEEDED':
      return (
        <div className='form-special-number transaction-log-table__status-bar'>
          {capitalizeFirstLetter(state)}
        </div>
      );
    case 'FAILED':
    case 'ERRORED':
      return (
        <div className='form-special-number transaction-log-table__status-bar transaction-log-table__status-bar--fail'>
          {capitalizeFirstLetter(state)}
        </div>
      );
    case 'PENDING':
      return (
        <div className='form-special-number transaction-log-table__status-bar transaction-log-table__status-bar--pending'>
          {capitalizeFirstLetter(state)}
        </div>
      );
    default:
      return null;
  }
}

/**
 * @param {Object} props
 * @param {LogEntry[]} props.log
 */
function TransactionLogTable({ log }) {
  return log?.length === 0 ? (
    <Spinner />
  ) : (
    <Table
      title='Recent Submissions'
      header={[
        'Id',
        'Submitter',
        'Project',
        'Created Date',
        'File Size',
        'State',
      ]}
      data={log.map((entry) => [
        entry.id,
        entry.submitter,
        entry.project_id,
        getLocalTime(entry.created_datetime),
        humanFileSize(getTotalFileSize(entry.documents)),
        stateToColor(entry.state),
      ])}
    />
  );
}

TransactionLogTable.propTypes = {
  log: PropTypes.array.isRequired,
};

export default TransactionLogTable;
