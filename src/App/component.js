import React from 'react';
import { Box } from '../theme';
import Nav from '../Nav/component.js'
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Link } from 'react-router';
import { BoxWithNavAndTimeout } from '../component';

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

const SubmissionComponent = ({submission}) => {
  return (
    <BoxWithNavAndTimeout>
      <h3>Submission projects</h3>
      <ul>
        {submission.projects &&
          <div>
           {submission.projects.map((project) => {return <ProjectLink to={'/'+project} key={project}>{project}</ProjectLink>})}
          </div>
        }
      </ul>
    </BoxWithNavAndTimeout>
  )

};

const mapStateToProps = (state) => {
  return {
    'submission': state.submission
  }
};

const mapDispatchToProps = (dispatch) => {
  return {};
};


let Submission = connect(mapStateToProps, mapDispatchToProps)(SubmissionComponent);
export default Submission;
