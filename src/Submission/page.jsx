import React from 'react';
import ReduxProjectDashboard from './ReduxProjectDashboard';
import ReduxTransaction from './ReduxTransaction';
import { getTransactionList, getProjectsList } from './relayer';

class SubmissionPage extends React.Component {
  constructor(props) {
    super();
    getProjectsList();
    getTransactionList();
  }

  render() {
    return (
      <div style={{ padding: '40px 20px' }}>
        <ReduxProjectDashboard />
        <ReduxTransaction />
      </div>
    );
  }
}

export default SubmissionPage;
