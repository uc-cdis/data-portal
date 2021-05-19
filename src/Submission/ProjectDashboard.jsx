import React from 'react';
import PropTypes from 'prop-types';
import ReduxSubmissionHeader from './ReduxSubmissionHeader';
import ProjectTable from '../components/tables/ProjectTable';
import './ProjectDashboard.less';

/**
 * @param {Object} props
 * @param {{ name: string; counts: number[]; }[]} props.projectList
 * @param {string[]} props.summaryFields
 */
function ProjectDashboard({ projectList, summaryFields }) {
  return (
    <div className='project-dashboard'>
      <div className='h2-typo project-dashboard__title'>Data Submission</div>
      <ReduxSubmissionHeader />
      <ProjectTable projectList={projectList} summaryFields={summaryFields} />
    </div>
  );
}

ProjectDashboard.propTypes = {
  projectList: PropTypes.array.isRequired,
  summaryFields: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ProjectDashboard;
