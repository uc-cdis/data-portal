import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import DataSummaryCardGroup from './cards/DataSummaryCardGroup';
import ProjectTable from './tables/ProjectTable';

const DashTopDiv = styled.div`
  height: 120px;
  display: flex;
`;

const Title = styled.div`
  padding-top: 10px;
  flex-basis: 460px;
`;

class ProjectDashboard extends Component {
  render() {
    const projectList = this.props.projectList || [];
    return (
      <div className="clearfix">
        <DashTopDiv>
          <Title className="h1-typo">
            Data Submission Summary
          </Title>
          <DataSummaryCardGroup
            width={760} height={120} summaryItems={this.props.summaries} align="left" />
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
