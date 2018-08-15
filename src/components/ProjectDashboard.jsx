import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DataSummaryCardGroup from './cards/DataSummaryCardGroup';
import ProjectTable from './tables/ProjectTable';
import './ProjectDashboard.less';

class ProjectDashboard extends Component {
  render() {
    const projectList = this.props.projectList || [];
    return (
      <React.Fragment>
        <div className='project-dashboard'>
          <div className='h1-typo project-dashboard__title'>
            Data Submission Summary
          </div>
          <DataSummaryCardGroup
            width={760}
            height={120}
            summaryItems={this.props.summaries}
            align='left'
          />
        </div>
        <ProjectTable projectList={projectList} summaries={this.props.details} />
      </React.Fragment>
    );
  }
}

ProjectDashboard.propTypes = {
  summaries: PropTypes.arrayOf(PropTypes.object).isRequired,
  details: PropTypes.arrayOf(PropTypes.object).isRequired,
  projectList: PropTypes.array.isRequired,
};

export default ProjectDashboard;
