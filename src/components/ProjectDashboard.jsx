import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { clearFix } from 'polished';
import CountCard from './cards/CountCard';
import ProjectTable from './tables/ProjectTable';

const DashTopDiv = styled.div`
  ${clearFix()},
`;

class ProjectDashboard extends Component {
  render() {
    const projectList = this.props.projectList || [];
    return (
      <div className="clearfix">
        <DashTopDiv>
          <CountCard
            countItems={this.props.summaries}
          />
          {/* <ReduxProjectBarChart projectList={this.props.projectList} /> */}
        </DashTopDiv>
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
