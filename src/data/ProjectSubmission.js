import React from 'react';
import Nav from './nav.js'
import { connect } from 'react-redux';
import SubmitTSV from './submitTSV'
import styled from 'styled-components';
import { Box } from '../theme';
import { Link } from 'react-router';


const ProjectSubmission = (props) => (
  <Box>
    <Nav />
    <h2>{props.params.project=='graphql' ? 'Query graph': props.params.project}</h2>
    <SubmitTSV path={props.params.project} />
  </Box>
)

export default ProjectSubmission;
