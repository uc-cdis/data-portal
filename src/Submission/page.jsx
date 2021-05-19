import React from 'react';
import ProjectDashboard from './ProjectDashboard';
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
        <ProjectDashboard />
        <ReduxTransaction />
      </div>
    );
  }
}

export default SubmissionPage;
