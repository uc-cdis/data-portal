import React from 'react';
import Nav from './nav.js'
import { connect } from 'react-redux';
import SubmitTSV from './submitTSV'
import styled from 'styled-components';
import { Box } from '../theme';
import { Link } from 'react-router';

const Browse = styled(Link)`
  display: inline-block;
  font-style: italic;
  padding: 0px 5px;
  vertical-align: sub;
  background: #e1f7e3
  margin-bottom: 15px;
`;
export const Title = styled.h2`
  display: inline-block;
  vertical-align: middle;
  margin: 15px 0px;
  margin-right: 0.5em;
`;

const ProjectSubmission = (props) => (
  <Box>
    <Nav />
    <Title>{props.params.project=='graphql' ? 'Query graph': props.params.project}</Title>
    <Browse to={'/' + props.params.project + '/search'}>browse nodes</Browse>
    <SubmitTSV path={props.params.project} />
  </Box>
)

export default ProjectSubmission;
