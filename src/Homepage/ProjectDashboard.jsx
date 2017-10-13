import React from 'react';
import Relay from 'react-relay/classic';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { clearFix } from 'polished';
import CircleButton from '../components/CircleButton';
import { Link } from 'react-router';
import ActionSearch from 'material-ui/svg-icons/action/search';
import ActionBook from 'material-ui/svg-icons/action/book';
import { ProjectTable } from './ProjectTable';
import ReduxProjectBarChart from './ReduxProjectBarChart';
import Translator from './translate';


const tor = Translator.getTranslator();


const CountBox = styled.div`
  float: left;
  width: 30%;
  height: 280px;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 10px, rgba(0, 0, 0, 0.23) 0px 3px 10px;
  padding: 30px;
  border-top: 3px solid #c87152;
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
  color: #ff4200;
  margin-right: 10px;
`;


const DashTopDiv = styled.div`
  ${clearFix()}
`;

const Icon = styled.div`
  color: #008000;
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
            Data Summary
        </h4>
        <ul>
          <li>
            <Icon><i className="material-icons">account_circle</i></Icon>
            <Count>{ this.props.caseCount }</Count>
            <span>Cases</span>
          </li>
          <li>
            <Icon><i className="material-icons">receipt</i></Icon>
            <Count>{ this.props.experimentCount }</Count>
            <span>{tor.translate('Experiments')}</span>
          </li>
          <li>
            <Icon><i className="material-icons">description</i></Icon>
            <Count>{ this.props.fileCount }</Count>
            <span>Files</span>
          </li>
          <li>
            <Icon><i className="material-icons">invert_colors</i></Icon>
            <Count>{ this.props.aliquotCount }</Count>
            <span>Aliquots</span></li>
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
        <CountCard caseCount={this.props.caseCount} experimentCount={this.props.experimentCount} fileCount={this.props.fileCount} aliquotCount={this.props.aliquotCount} />
        <ReduxProjectBarChart projectList={this.props.projectList} />
      </DashTopDiv>
    );
  }
}


export function DashboardWith(Table) {
  return class ProjectDashboard extends React.Component {
    render() {
      const props = this.props;
      const summaryCounts = this.props.summaryCounts || {};
      const projectList = this.props.projectList || [];
      return (<div className="clearfix">
        <LittleProjectDashboard
          projectList={projectList}
          experimentCount={summaryCounts.experimentCount}
          caseCount={summaryCounts.caseCount}
          fileCount={summaryCounts.fileCount}
          aliquotCount={summaryCounts.aliquotCount}
        />
        <Table projectList={projectList} summaryCounts={summaryCounts} />
      </div>);
    }
  };
}

export const ProjectDashboard = DashboardWith(ProjectTable);

