import React from 'react';
import Relay from 'react-relay'
import styled from 'styled-components';
import { Link } from 'react-router';
import { clearFix } from 'polished';
import { CustomPieChart, StackedBarChart } from './Visualizations.js';

import IconButton from 'material-ui/IconButton';
import ActionSearch from 'material-ui/svg-icons/action/search';
import ActionBook from 'material-ui/svg-icons/action/book';


const CircleButton = styled(IconButton)`
background-color: #ebe7e5 !important;
border-radius: 50%;
margin: 20px !important;
margin-top: 20px !important;
`;


const DetailDiv = styled.div`
${clearFix()}
height: 500px;
width: 400px;
overflow: auto;
float: left;
background-color: #eeeeee;
border-radius: 5px;
padding: 10px;
margin: 10px;
box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 10px, rgba(0, 0, 0, 0.23) 0px 3px 10px;
ul.px-detail_stats {
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


/**
 * Little ProjectDetail block to drop onto the project dashboard with properties:
 *       name, description, experimentCount, caseCount
 */
export class ProjectTile extends React.Component {
  
  render () {
    const projectList = [ 
      { name: this.props.name, experimentCount: this.props.experimentCount, caseCount:this.props.caseCount }
    ];

    return (
      <DetailDiv>
        <div>
          <span className="h5">{this.props.name}</span>
          <Link to={this.props.name + "/search"} title="Search"><CircleButton><ActionSearch /></CircleButton></Link>
          <Link to={this.props.name} title="Submit Data"><CircleButton><ActionBook /></CircleButton></Link>
          </div>
        <ul className="px-detail_stats">
          <li><Count>{ this.props.caseCount }</Count> <span>Cases</span></li>
          <li><Count>{ this.props.experimentCount }</Count> <span>Experiments</span></li>
          <li><Count>{ this.props.caseCount }</Count> <span>Files</span></li>
          <li><Count>{ this.props.aliquotCount }</Count> <span>Aliquots</span></li>
        </ul>
          
        <StackedBarChart projectList={projectList} />
      </DetailDiv>
    );
  }
}


/**
 * Relay adapter for project detail
 */
export const RelayProjectTile = Relay.createContainer(
  function( dirtyProps ) { // graphql to props adapter
    const viewer = dirtyProps.viewer || {
      project: [{
        name: "unknown",
        experimentCount: 0
      }],
      caseCount: 0
    };
    console.log( "RelayProjectDetail got details: ", dirtyProps );
    
    const props = { ...viewer.project[0], caseCount:viewer.caseCount };
    return <ProjectTile { ...props} />;
  },
  {
    initialVariables: { // don't forget this hint to the parent query!
      name: null
    },
    fragments: {
      viewer: () => Relay.QL`
        fragment on viewer {
          project(project_id: $name) {
            name:project_id
            experimentCount:_experiments_count
          }
          caseCount:_case_count( project_id: $name )
        }`
    }
  }
);



