import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import SubmitTSV from './SubmitTSV';
import DataModelGraph from '../DataModelGraph/DataModelGraph';
import SubmitForm from './SubmitForm';
import Spinner from '../components/Spinner';
import './ProjectSubmission.less';
import { useArboristUI } from '../configs';
import { shouldDisplayProjectUIComponents, userHasCreateOrUpdateMethodOnProject } from '../authMappingUtils';
import NotFound from '../components/NotFound';

const ProjectSubmission = (props) => {
  // hack to detect if dictionary data is available, and to trigger fetch if not
  if (!props.dataIsReady) {
    props.onGetCounts(props.typeList, props.project, props.dictionary);
  }

  // Passing children in as props allows us to swap in different containers -
  // dumb, redux, ...
  const MySubmitForm = props.submitForm;
  const MySubmitTSV = props.submitTSV;
  const MyDataModelGraph = props.dataModelGraph;
  const displayData = () => {
    if (!props.dataIsReady) {
      if (props.project !== '_root') {
        return <Spinner />;
      }
      return null;
    }
    return <MyDataModelGraph project={props.project} />;
  };

  const displaySubmissionForms = (project, userAuthMapping) => {
    if (userHasCreateOrUpdateMethodOnProject(project, userAuthMapping)) {
      return (
        <React.Fragment>
          <MySubmitForm />
          <MySubmitTSV project={props.project} />
        </React.Fragment>
      );
    }
    return null;
  };

  return (
    shouldDisplayProjectUIComponents(
      props.project,
      props.userAuthMapping,
      useArboristUI,
    ) ?
      <div className='project-submission'>
        <h2 className='project-submission__title'>{props.project}</h2>
        {
          <Link
            className='project-submission__link'
            to={`/${props.project}/search`}
          >browse nodes</Link>
        }
        { displaySubmissionForms(props.project, props.userAuthMapping) }
        { displayData() }
      </div>
      :
      <NotFound />
  );
};

ProjectSubmission.propTypes = {
  project: PropTypes.string.isRequired,
  dataIsReady: PropTypes.bool,
  dictionary: PropTypes.object.isRequired,
  submitForm: PropTypes.func,
  submitTSV: PropTypes.func,
  dataModelGraph: PropTypes.func,
  onGetCounts: PropTypes.func.isRequired,
  typeList: PropTypes.array,
  userAuthMapping: PropTypes.object.isRequired,
};

ProjectSubmission.defaultProps = {
  dataIsReady: false,
  submitForm: SubmitForm,
  submitTSV: SubmitTSV,
  dataModelGraph: DataModelGraph,
  typeList: [],
};

export default ProjectSubmission;
