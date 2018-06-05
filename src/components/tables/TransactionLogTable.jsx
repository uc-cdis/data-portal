import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Table from './base/Table';
import Spinner from '../Spinner';

const StatusBar = styled.div`
  font-size: 16px;
  text-align: left;
`;

const FailBar = styled(StatusBar)`
  color: #ff2200;
`;

const PendingBar = styled(StatusBar)`
  color: #999900;
`;

const formatText = text => text[0] + text.slice(1).toLowerCase();

class TransactionLogTable extends Component {
  getLocalTime = (gmtTimeString) => {
    const date = new Date(gmtTimeString);
    const offsetMins = date.getTimezoneOffset();
    const offsetHous = -offsetMins / 60;
    return `${date.toLocaleString()} UTC${(offsetMins > 0) ? '' : '+'}${offsetHous}`;
  };

  stateToColor = state => (state === 'SUCCEEDED' &&
      <StatusBar className="special-number">{formatText(state)}</StatusBar>)
    || ((state === 'FAILED' || state === 'ERRORED') &&
      <FailBar className="special-number">{formatText(state)}</FailBar>)
    || (state === 'PENDING' &&
      <PendingBar className="special-number">{formatText(state)}</PendingBar>);

  dataTransform = logs => logs.map(entry => [
    entry.id, entry.project_id,
    this.getLocalTime(entry.created_datetime),
    this.stateToColor(entry.state),
  ]);

  render() {
    if (!this.props.log || this.props.log === []) { return <Spinner />; }
    return (<Table
      title="Recent Submissions"
      header={['Id', 'Project', 'Create', 'State']}
      data={this.dataTransform(this.props.log)}
    />);
  }
}

TransactionLogTable.propTypes = {
  log: PropTypes.array.isRequired,
};

export default TransactionLogTable;
