import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ProjectTable from '../components/tables/ProjectTable';
import ReduxSubmissionHeader from './ReduxSubmissionHeader';
import './ProjectDashboard.less';

class ProjectDashboard extends Component {
  render() {
    const projectList = this.props.projectList || [];
    return (
      <div className='project-dashboard'>
        <div className='h1-typo project-dashboard__title'>
          Data Submission
        </div>
        <ReduxSubmissionHeader />
        <ProjectTable projectList={projectList} summaries={this.props.details} />
      </div>
    );
  }
}

ProjectDashboard.propTypes = {
  summaries: PropTypes.arrayOf(PropTypes.object).isRequired,
  details: PropTypes.arrayOf(PropTypes.object).isRequired,
  projectList: PropTypes.array.isRequired,
};

export default ProjectDashboard;
