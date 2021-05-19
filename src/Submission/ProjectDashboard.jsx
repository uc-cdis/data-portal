import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReduxSubmissionHeader from './ReduxSubmissionHeader';
import ProjectTable from '../components/tables/ProjectTable';
import './ProjectDashboard.less';

class ProjectDashboard extends Component {
  render() {
    return (
      <div className='project-dashboard'>
        <div className='h2-typo project-dashboard__title'>Data Submission</div>
        <ReduxSubmissionHeader />
        <ProjectTable
          projectList={this.props.projectList}
          summaries={this.props.details}
        />
      </div>
    );
  }
}

ProjectDashboard.propTypes = {
  details: PropTypes.arrayOf(PropTypes.object).isRequired,
  projectList: PropTypes.array.isRequired,
};

export default ProjectDashboard;
