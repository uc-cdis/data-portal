import React from 'react';
import { Link } from 'react-router';
import styled from 'styled-components';

import SubmitTSV from './SubmitTSV';
import DataModelGraph from '../DataModelGraph/ReduxDataModelGraph';
import SubmitForm from './SubmitForm';
import Spinner from '../components/Spinner';

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

const ProjectSubmission = (props) => {
  if (props.counts_search === undefined || props.counts_search === null) {
    props.onGetCounts(props.node_types, props.params.project, props.dictionary);
  }

  const MySubmitForm = props.submitForm || SubmitForm;
  const MySubmitTSV = props.submitTSV || SubmitTSV;

  return (
    <div>
      <Title>{props.params.project}</Title>
      {
        <Browse to={`/${props.params.project}/search`}>browse nodes</Browse>
      }
      <MySubmitForm />
      <MySubmitTSV path={props.params.project} />
      {(props.counts_search === undefined || props.counts_search === null)
        ? <Spinner /> :
        <DataModelGraph project={props.params.project} /> }
    </div>
  );
};

export default ProjectSubmission;
