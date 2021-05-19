import React from 'react';
import PropTypes from 'prop-types';
import ReduxSubmissionHeader from './ReduxSubmissionHeader';
import ProjectTable from '../components/tables/ProjectTable';
import './ProjectDashboard.less';

/**
 * @param {Object} props
 * @param {{ label: string; value: number; }[]} props.details
 * @param {{ name: string; counts: number[]; }[]} props.projectList
 */
function ProjectDashboard({ details, projectList }) {
  return (
    <div className='project-dashboard'>
      <div className='h2-typo project-dashboard__title'>Data Submission</div>
      <ReduxSubmissionHeader />
      <ProjectTable projectList={projectList} summaries={details} />
    </div>
  );
}

ProjectDashboard.propTypes = {
  details: PropTypes.arrayOf(PropTypes.object).isRequired,
  projectList: PropTypes.array.isRequired,
};

export default ProjectDashboard;
