import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { boardPluralNames, detailPluralNames, dashboardIcons } from '../../localconf';
import LittleProjectDashboard from './ProjectDashboard';

export function DashboardWith(Table) {
  return class ProjectDashboard extends Component {
    static propTypes = {
      summaryCounts: PropTypes.array.isRequired,
      projectList: PropTypes.array.isRequired,
    };

    render() {
      const summaryCounts = this.props.summaryCounts || {};
      const projectList = this.props.projectList || [];
      const summaries = Object.keys(summaryCounts).map(
        key => ({ label: boardPluralNames[key], value: summaryCounts[key] }),
      );
      const details = Object.keys(summaryCounts).map(
        key => ({ label: detailPluralNames[key], value: summaryCounts[key] }),
      );
      return (<div className="clearfix">
        <LittleProjectDashboard
          projectList={projectList}
          summaries={summaries}
          icons={dashboardIcons}
        />
        <Table projectList={projectList} summaries={details} />
      </div>);
    }
  };
}
