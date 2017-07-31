import React from 'react';
import { withBoxAndNav, withAuthTimeout } from '../utils';
import Relay from 'react-relay'
import styled from 'styled-components';
import { Link } from 'react-router';

const ProjectLink = styled(Link)`
  cursor: pointer;
  li;
  background: ghostwhite;
  padding: 5px;
  border-radius: 5px;
  display: inline-block;
  margin-bottom: 1em;
  margin-right: 1em;
  color: #8a6d3b;
  &:hover,
  &:focus,
  &:active {
    border: 1px solid #8a6d3b;
    color: #8a6d3b;
  }
`;

class SubmissionComponent extends React.Component {
  static propTypes = {
    viewer: React.PropTypes.object,
  };
  render () {
    return (
      <div>
        <h3>Submission projects</h3>
        <ul>
          {this.props.viewer.project.map((p)=> <ProjectLink to={'/'+p.project_id} key={p.project_id}>{p.project_id}</ProjectLink>)}
        </ul>
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
              project {
                  project_id
                  code
              }
          }
      `,
    },
  },
);
export default Submission;
