import React from 'react';
import styled from 'styled-components';
import { clearFix } from 'polished';
import { ProjectTable } from './ProjectTable';
import ReduxProjectBarChart from './ReduxProjectBarChart';
import Translator from '../translate';
import { countNames, countPluralNames, dashboardIcons, localTheme } from '../../localconf';

const tor = Translator.getTranslator();


const CountBox = styled.div`
  float: left;
  width: 40%;
  height: 280px;
  padding: 20px;
  border: 2px solid ${localTheme['summary.borderColor']};
  border-top: 3px solid ${localTheme['summary.borderTopColor']};
  min-width:300px;
  h4 {
    margin-top: 0px;
  }
  ul {
    width: 100%;
    overflow: hidden;
    li {
      float: left;
      width: 50%;
      padding-left: 10px;
      padding-top: 10px;
    }
  }
`;

const Count = styled.span`
  color: ${localTheme['summary.countColor']};
  margin-right: 10px;
`;


const DashTopDiv = styled.div`
  ${clearFix()}
`;

const Icon = styled.div`
  color: ${localTheme['summary.iconColor']};
  height: 24px;
  margin-top: 10px;
  margin-left: 20px;
`;
/**
 * Little card with a bunch of counters on it for cases, experiments, files, ...
 */
class CountCard extends React.Component {
  render() {
    return (
      <CountBox>
        <h4>
            Project Submission Summary
        </h4>
        <ul>
          <li>
            <Icon><i className="material-icons">{ this.props.icons[0] }</i></Icon>
            <Count>{ this.props.count1.value }</Count>
            <span>{this.props.count1.label}</span>
          </li>
          <li>
            <Icon><i className="material-icons">{ this.props.icons[1] }</i></Icon>
            <Count>{ this.props.count2.value }</Count>
            <span>{this.props.count2.label}</span>
          </li>
          <li>
            <Icon><i className="material-icons">{ this.props.icons[2] }</i></Icon>
            <Count>{ this.props.count3.value }</Count>
            <span>{this.props.count3.label}</span>
          </li>
          <li>
            <Icon><i className="material-icons">{ this.props.icons[3] }</i></Icon>
            <Count>{ this.props.count4.value }</Count>
            <span>{this.props.count4.label}</span>
          </li>
        </ul>
      </CountBox>
    );
  }
}


/**
 * Project dashbaord - list projects with various stats and links
 * for submission page, whatever.
 *   props { caseCount, experimnentCount, fileCount, aliquoteCount, projectList
 *    }
 * where
 *
 *   const projectList = [
 *       {name: 'bpa-test', experiments: 4000, cases: 2400, amt: 2400},
 *       {name: 'ProjectB', experiments: 3000, cases: 1398, amt: 2210},
 *       {name: 'ProjectC', experiments: 2000, cases: 9800, amt: 2290},
 *       {name: 'ProjectD', experiments: 2780, cases: 3908, amt: 2000},
 *       {name: 'ProjectE', experiments: 1890, cases: 4800, amt: 2181},
 *       {name: 'ProjectRye', experiments: 2390, cases: 3800, amt: 2500},
 *
 *   ];
 */
export class LittleProjectDashboard extends React.Component {
  render() {
    return (
      <DashTopDiv>
        <CountCard
          count1={this.props.summaries[0]}
          count2={this.props.summaries[1]}
          count3={this.props.summaries[2]}
          count4={this.props.summaries[3]}
          icons={this.props.icons}
        />
        <ReduxProjectBarChart projectList={this.props.projectList} />
      </DashTopDiv>
    );
  }
}


export function DashboardWith(Table) {
  return class ProjectDashboard extends React.Component {
    render() {
      const summaryCounts = this.props.summaryCounts || {};
      const projectList = this.props.projectList || [];
      const summaries = [];
      summaries.push({ label: countPluralNames[0], value: summaryCounts.countOne });
      summaries.push({ label: countPluralNames[1], value: summaryCounts.countTwo });
      summaries.push({ label: countPluralNames[2], value: (countNames[2] === 'File') ? summaryCounts.fileCount : summaryCounts.countThree });
      summaries.push({ label: countPluralNames[3], value: summaryCounts.countThree });
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

export const ProjectDashboard = DashboardWith(ProjectTable);

