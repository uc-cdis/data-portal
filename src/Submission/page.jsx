import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import ProjectDashboard from './ProjectDashboard';
import ReduxTransaction from './ReduxTransaction';
import { getTransactionList, getProjectsList } from './relayer';

function SubmissionPage() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getProjectsList());
    dispatch(getTransactionList());
  }, []);

  return (
    <div style={{ padding: '40px 20px' }}>
      <ProjectDashboard />
      <ReduxTransaction />
    </div>
  );
}

export default SubmissionPage;
