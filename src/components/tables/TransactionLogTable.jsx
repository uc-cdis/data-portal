import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Table from './base/Table';
import Spinner from '../Spinner';
import './TransactionLogTable.less';

const formatText = text => text[0] + text.slice(1).toLowerCase();

class TransactionLogTable extends Component {
  getLocalTime = (gmtTimeString) => {
    const date = new Date(gmtTimeString);
    const offsetMins = date.getTimezoneOffset();
    const offsetHous = -offsetMins / 60;
    return `${date.toLocaleString()} UTC${(offsetMins > 0) ? '' : '+'}${offsetHous}`;
  };

  stateToColor = state => (state === 'SUCCEEDED' &&
      <div className='form-special-number transaction-log-table__status-bar'>{formatText(state)}</div>)
    || ((state === 'FAILED' || state === 'ERRORED') &&
      <div className='form-special-number transaction-log-table__status-bar transaction-log-table__status-bar--fail'>{formatText(state)}</div>)
    || (state === 'PENDING' &&
      <div className='form-special-number transaction-log-table__status-bar transaction-log-table__status-bar--pending'>{formatText(state)}</div>);

  dataTransform = logs => logs.map(entry => [
    entry.id, entry.project_id,
    this.getLocalTime(entry.created_datetime),
    this.stateToColor(entry.state),
  ]);

  render() {
    if (!this.props.log || this.props.log === []) { return <Spinner />; }
    return (<Table
      title='Recent Submissions'
      header={['Id', 'Project', 'Create', 'State']}
      data={this.dataTransform(this.props.log)}
    />);
  }
}

TransactionLogTable.propTypes = {
  log: PropTypes.array.isRequired,
};

export default TransactionLogTable;
