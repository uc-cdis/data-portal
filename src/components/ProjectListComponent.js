import React from 'react';
import { withBoxAndNav, withAuthTimeout } from '../utils';
import Relay from 'react-relay'
import styled from 'styled-components';
import { Link } from 'react-router';
import { CustomPieChart, StackedBarChart } from './Visualizations.js';
import IconButton from 'material-ui/IconButton';
import ActionSearch from 'material-ui/svg-icons/action/search';
import ActionBook from 'material-ui/svg-icons/action/book';


let CountBox = styled.div`
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
let Count = styled.span`
  color: #ff4200;
  margin-right: 10px;
`;

let CircleButton = styled(IconButton)`
  background-color: #ebe7e5 !important;
  border-radius: 50%;
  margin-right: 20px !important;
  margin-top: 20px !important;
`;
let CountCard = () => {
  return (
    <CountBox>
      <h4>
          Data Summary
      </h4>
      <ul>
        <li><Count>30241</Count><span>Cases</span></li>
        <li><Count>25013</Count><span>Experiments</span></li>
        <li><Count>304</Count><span>Files</span></li>
        <li><Count>43340</Count><span>Aliquots</span></li>
      </ul>
      <CircleButton><ActionSearch /></CircleButton>
      <CircleButton><ActionBook /></CircleButton>
    </CountBox>
  )
};

class SubmissionComponent extends React.Component {
  static propTypes = {
    viewer: React.PropTypes.object,
  };
  render () {
    return (
      <div>
        <CountCard />
        <StackedBarChart />
      </div>
    )
  }
}


let Submission = Relay.createContainer(
  withBoxAndNav(withAuthTimeout(SubmissionComponent)),
  {
    fragments: {
      viewer: () => Relay.QL`
          fragment on viewer {
              project (first: 10000) {
                  project_id
                  code
              }
              _case_count
              _experiment_count
          }
      `,
    },
  },
);
export default Submission;
