import React from 'react';
import Nav from '../Nav/component.js'
import { connect } from 'react-redux';
import SubmitTSV from './submitTSV'
import styled from 'styled-components';
import { Link } from 'react-router';
import DataModelGraph from '../DataModelGraph/component';
import { getCounts } from '../DataModelGraph/actions'
import SubmitForm from './submitForm';

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

const ProjectSubmissionComponent = (props) => {
  if (props.counts_search == undefined || props.counts_search == null) {
    props.onGetCounts(props.node_types, props.params.project, props.dictionary)
  }

  return (
    <div>
      <Title>{props.params.project}</Title>
      {
        <Browse to={'/' + props.params.project + '/search'}>browse nodes</Browse>
      }
      {props.params.project != 'graphql' && <SubmitForm />}
      <SubmitTSV path={props.params.project} />
        {(props.counts_search != undefined || props.counts_search != null)
        && <DataModelGraph project={props.params.project}/> }
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    'node_types': state.submission.node_types,
    'counts_search': state.submission.counts_search,
    'dictionary': state.submission.dictionary,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    onGetCounts: (type, project, dictionary) => dispatch(getCounts(type, project, dictionary)),
  };
}
const ProjectSubmission = connect(mapStateToProps, mapDispatchToProps)(ProjectSubmissionComponent);
export default ProjectSubmission;
