import React from 'react';
import { withBoxAndNav, withAuthTimeout } from '../utils';
import Relay from 'react-relay'
import styled from 'styled-components';
import { Link } from 'react-router';
import { CustomPieChart, StackedBarChart } from './Visualizations.js';
import IconButton from 'material-ui/IconButton';
import ActionSearch from 'material-ui/svg-icons/action/search';
import ActionBook from 'material-ui/svg-icons/action/book';


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


class ProjectListComponent extends React.Component {
  static propTypes = {
    viewer: React.PropTypes.object,
  };
  render () {
    const projectList = [ /*
        {name: 'bpa-test', experiments: 4000, cases: 2400, amt: 2400},
        {name: 'ProjectB', experiments: 3000, cases: 1398, amt: 2210},
        {name: 'ProjectC', experiments: 2000, cases: 9800, amt: 2290},
        {name: 'ProjectD', experiments: 2780, cases: 3908, amt: 2000},
        {name: 'ProjectE', experiments: 1890, cases: 4800, amt: 2181},
        {name: 'ProjectRye', experiments: 2390, cases: 3800, amt: 2500},
        */
    ];

    this.props.viewer.project.forEach(
      (proj) => {
        projectList.push( { name:proj.project_id, experiments: proj._experiments_count, cases: 2, amt: 0 });
      }
    );


    return (
      <div>
        <CountCard caseCount={ this.props.viewer._case_count } experimentCount={ this.props.viewer._experiment_count } fileCount="8888" aliquotCount={ this.props.viewer._aliquot_count } />
        <StackedBarChart projectList={projectList} />
      </div>
    )
  }
}


const ProjectList = Relay.createContainer(
  withBoxAndNav(withAuthTimeout(ProjectListComponent)),
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
      `,
    },
  },
);

export default ProjectList;
