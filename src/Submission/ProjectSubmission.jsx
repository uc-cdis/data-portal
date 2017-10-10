import React from 'react';
import { Link } from 'react-router';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import SubmitTSV from './SubmitTSV';
import DataModelGraph from '../DataModelGraph/DataModelGraph';
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
  // hack to detect if dictionary data is available, and to trigger fetch if not
  if (!props.dataIsReady) {
    props.onGetCounts(props.typeList, props.params.project, props.dictionary);
  }

  const MySubmitForm = props.submitForm;
  const MySubmitTSV = props.submitTSV;
  const MyDataModelGraph = props.dataModelGraph;

  return (
    <div>
      <Title>{props.params.project}</Title>
      {
        <Browse to={`/${props.params.project}/search`}>browse nodes</Browse>
      }
      <MySubmitForm />
      <MySubmitTSV path={props.params.project} />
      { !props.dataIsReady
        ? <Spinner /> :
        <MyDataModelGraph project={props.params.project} /> }
    </div>
  );
};

ProjectSubmission.propTypes = {
  dataIsReady: PropTypes.bool,
  params: PropTypes.shape({
    project: PropTypes.string.isRequired,
  }).isRequired,
  dictionary: PropTypes.object.isRequired,
  submitForm: PropTypes.func,
  submitTSV: PropTypes.func,
  dataModelGraph: PropTypes.func,
  onGetCounts: PropTypes.func.isRequired,
  typeList: PropTypes.array,
};

ProjectSubmission.defaultProps = {
  dataIsReady: false,
  submitForm: SubmitForm,
  submitTSV: SubmitTSV,
  dataModelGraph: DataModelGraph,
  typeList: [],
};

export default ProjectSubmission;
