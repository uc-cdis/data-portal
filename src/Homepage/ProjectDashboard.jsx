import React, {Component, PropTypes} from 'react';
import Relay, {createFragmentContainer} from 'react-relay';
import styled from 'styled-components';
import { clearFix } from 'polished';
import CircleButton from '../components/CircleButton.jsx';
import { Link } from 'react-router';
import ActionSearch from 'material-ui/svg-icons/action/search';
import ActionBook from 'material-ui/svg-icons/action/book';
import {PTableRelayAdapter} from './ProjectTable.jsx';
import {GQLHelper} from './gqlHelper.js';
import {getReduxStore} from '../reduxStore.js';
import ReduxProjectBarChart from "./ReduxProjectBarChart.js";
import Translator from "./translate.js";
import {withAuthTimeout, withBoxAndNav} from "../utils";


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
            <span>{tor.translate( "Experiments" )}</span>
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

          <Link to="/query" title="Search"><CircleButton><ActionSearch /></CircleButton></Link>
          <Link to="/dd" title="View Dictionary"><CircleButton><ActionBook /></CircleButton></Link>
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
  
  render () {
    return (
      <DashTopDiv>
        <CountCard caseCount={ this.props.caseCount } experimentCount={ this.props.experimentCount }
                   fileCount={this.props.fileCount} aliquotCount={ this.props.aliquotCount } />
        <ReduxProjectBarChart projectList={this.props.projectList} />
      </DashTopDiv>
    );
  }
}



const gqlHelper = GQLHelper.getGQLHelper();

class ProjectDashboardComponent extends Component {
  static propTypes = {
    viewer: PropTypes.object
  };

  createProjectList = () => {
    projectList = this.props.viewer.project.map( function(proj) {
      return {
        name:proj.project_id,
        experimentCount: proj._experiments_count,
        caseCount: 0, aliquotCount: 0, fileCount:0
      };
    });
    return projectList;
  };

  createSummaryCounts = () => {
    viewer = this.props.viewer;
    const {fileCount} = GQLHelper.extractFileInfo( viewer );
    //console.log( "Got filecount: " + fileCount );
    return {
      caseCount: viewer._case_count,
      experimentCount: viewer._experiment_count,
      aliquotCount: viewer._aliquot_count,
      fileCount: fileCount
    };
  };

  updateProjectList = (projectList) => {
    getReduxStore().then(
      (store) => {
        const homeState = store.getState().homepage || {};
        if ( ! homeState.projectsByName  ) {
          store.dispatch( { type: 'RECEIVE_PROJECT_LIST', data: projectList } );
        } /* else {
          console.log( "project list already in Redux store" );
        } */
      }
    );
  };

  render() {
    let projectList = this.createProjectList();
    this.updateProjectList(projectList);
    let summaryCounts = this.createSummaryCounts();
    const cleanProps = {
      projectList:projectList,
      ...summaryCounts
    };
    return (
      <div className="clearfix">
        <LittleProjectDashboard { ...cleanProps} />
        <PTableRelayAdapter projectList={cleanProps.projectList} summaryCounts={summaryCounts} />
      </div>
    );
  }
}

/**
 * Relay customization of ProjectListComponent with nav and auth popup wrapped around it and
 * relay magic.
 */
export const RelayProjectDashboard = createFragmentContainer(
  withBoxAndNav(withAuthTimeout(ProjectDashboardComponent)),
  {
    viewer: () => gqlHelper.projectDashboardFragment
  },
);
