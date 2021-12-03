import ReduxSubmissionHeader from './ReduxSubmissionHeader';
import ReduxProjectTable from './ReduxProjectTable';
import './ProjectDashboard.less';

function ProjectDashboard() {
  return (
    <div className='project-dashboard'>
      <div className='h2-typo project-dashboard__title'>Data Submission</div>
      <ReduxSubmissionHeader />
      <ReduxProjectTable />
    </div>
  );
}

export default ProjectDashboard;
