import React from 'react';
import Nav from '../Nav/component.js'
import { connect } from 'react-redux';
import SubmitTSV from './submitTSV'
import styled from 'styled-components';
import { Box } from '../theme';
import { Link } from 'react-router';
import DataModelGraph from '../DataModelGraph/component';

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

const ProjectSubmissionComponent = (props) => (
  <Box>
    <Nav />
    <Title>{props.params.project=='graphql' ? 'Query graph': props.params.project}</Title>
    {props.params.project != 'graphql' &&
    <Browse to={'/' + props.params.project + '/search'}>browse nodes</Browse>
    }
    { props.submission.counts_search != undefined 
        && <DataModelGraph project={props.params.project}/>
    }
    <SubmitTSV path={props.params.project} />
  </Box>
);

const mapStateToProps = (state, ownProps) => {
  return {
    'submission': state.submission,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
  };
}
const ProjectSubmission = connect(mapStateToProps, mapDispatchToProps)(ProjectSubmissionComponent);
export default ProjectSubmission;
