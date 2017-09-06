import React from 'react';
import Relay from 'react-relay'
import { connect } from 'react-redux';
import styled from 'styled-components';
import { clearFix } from 'polished';

import { Link } from 'react-router';
import { CustomPieChart, StackedBarChart } from './Visualizations.js';
import IconButton from 'material-ui/IconButton';
import ActionSearch from 'material-ui/svg-icons/action/search';
import ActionBook from 'material-ui/svg-icons/action/book';
import {PTBRelayAdapter} from './ProjectTileBoard.jsx';
import {PTableRelayAdapter} from './ProjectTable.jsx';



const CountBox = styled.div`
  float: left;
  width: 30%;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 10px, rgba(0, 0, 0, 0.23) 0px 3px 10px;
  padding: 30px;
  border-top: 3px solid #c87152;
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

let CircleButton = styled(IconButton)`
  background-color: #ebe7e5 !important;
  border-radius: 50%;
  margin-right: 20px !important;
  margin-top: 20px !important;
`;

const DashTopDiv = styled.div`
  ${clearFix()}
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
          <li><Count>{ this.props.caseCount }</Count><span>Cases</span></li>
          <li><Count>{ this.props.experimentCount }</Count><span>Experiments</span></li>
          <li><Count>{ this.props.caseCount }</Count><span>Files</span></li>
          <li><Count>{ this.props.aliquotCount }</Count><span>Aliquots</span></li>
        </ul>
        <CircleButton><ActionSearch /></CircleButton>
        <CircleButton><ActionBook /></CircleButton>
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
export class ProjectDashboard extends React.Component {
  
  render () {
    return (
      <DashTopDiv>
        <CountCard caseCount={ this.props.caseCount } experimentCount={ this.props.experimentCount } fileCount="8888" aliquotCount={ this.props.aliquotCount } />
        <StackedBarChart projectList={this.props.projectList} />
      </DashTopDiv>
    )
  }
}


/**
 * Relay customization of ProjectListComponent with nav and auth popup wrapped around it and
 * relay magic.
 */
export const RelayProjectDashboard = Relay.createContainer(
  function({viewer}) {
    //
    // Little helper translates relay graphql results to properties
    // expected by the ProjectDashboard component
    //
    const projectList = viewer.project.map( function(proj) { return { name:proj.project_id, experimentCount: proj._experiments_count, caseCount: 2, aliquotCount: 0 }; }); 
    const summaryCounts = {
      caseCount: viewer._case_count,
      experimentCount: viewer._experiment_count,
      aliquotCount: viewer._aliquot_count,
      fileCount:200
    };
    const cleanProps = {
      projectList:projectList, ...summaryCounts
    };

    return <div className="clearfix">
      <ProjectDashboard { ...cleanProps} />
      <PTableRelayAdapter projectList={cleanProps.projectList} summaryCounts={summaryCounts} />  
      </div>
  },
  {
    fragments: {
      viewer: () => Relay.QL`
          fragment on viewer {
              project(first: 10000) {
                project_id
                code
                _experiments_count
              }
              _case_count
              _experiment_count
              _aliquot_count
          }
      `
    },
  },
);
