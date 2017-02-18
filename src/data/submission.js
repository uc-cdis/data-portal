import React from 'react';
import Nav from './nav.js'
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Link } from 'react-router';

const ProjectLink = styled(Link)`
  cursor: pointer;
  li;
  background: ${props => props.theme.color_tertiary};
  padding: 5px;
  color: white;
  &:hover,
  &:focus,
  &:active {
    color: ${props => props.theme.color_tertiary};
    background: white;
    border: 1px solid ${props => props.theme.color_tertiary};
  }
`

const SubmissionComponent = ( {submission} ) => {
  return (
    <div>
      <Nav />
      <h3>Submission projects</h3>
      <ul>
        {submission.projects.map((project) => {console.log(project); return <ProjectLink to={'/'+project} key={project}>{project}</ProjectLink>})}
      </ul>
  </div>
  )

}

const mapStateToProps = (state) => {
  return {
    'submission': state.submission
  }
}

const mapDispatchToProps = (dispatch) => {
  return {};
}


let Submission = connect(mapStateToProps, mapDispatchToProps)(SubmissionComponent);
export default Submission;