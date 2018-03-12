import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { countNames, countPluralNames, dashboardIcons } from '../../localconf';
import LittleProjectDashboard from './ProjectDashboard';

export function DashboardWith(Table) {
  return class ProjectDashboard extends Component {
    static propTypes = {
      summaryCounts: PropTypes.object.isRequired,
      projectList: PropTypes.array.isRequired,
    };

    render() {
      const summaryCounts = this.props.summaryCounts || {};
      const projectList = this.props.projectList || [];
      const summaries = [];
      summaries.push({ label: countPluralNames[0], value: summaryCounts.countOne });
      summaries.push({ label: countPluralNames[1], value: summaryCounts.countTwo });
      summaries.push({ label: countPluralNames[2], value: summaryCounts.countThree });
      summaries.push({ label: countPluralNames[3], value: (countNames[3] === 'File') ? summaryCounts.fileCount : summaryCounts.countFour });
      return (<div className="clearfix">
        <LittleProjectDashboard
          projectList={projectList}
          summaries={summaries}
          icons={dashboardIcons}
        />
        <Table projectList={projectList} summaryCounts={summaryCounts} />
      </div>);
    }
  };
}
