import React, { useEffect } from 'react';
import ProjectDashboard from './ProjectDashboard';
import ReduxTransaction from './ReduxTransaction';
import { getTransactionList, getProjectsList } from './relayer';

function SubmissionPage() {
  useEffect(() => {
    getProjectsList();
    getTransactionList();
  }, []);

  return (
    <div style={{ padding: '40px 20px' }}>
      <ProjectDashboard />
      <ReduxTransaction />
    </div>
  );
}

export default SubmissionPage;
