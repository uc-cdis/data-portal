import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import SubmitTSV from './SubmitTSV';
import DataModelGraph from '../DataModelGraph/DataModelGraph';
import SubmitForm from './SubmitForm';
import Spinner from '../components/Spinner';
import './ProjectSubmission.less';
import { useArboristUI } from '../configs';

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

  const userHasCreateOrUpdateForThisProject = () => {
    const actionHasCreateOrUpdate = x => { return x['method'] === 'create' || x['method'] === 'update' }

    var split = props.project.split('-');
    var program = split[0]
    var project = split.slice(1).join('-')
    var resourcePath = ["/programs", program, "projects", project].join('/')

    var resource = props.userAuthMapping[resourcePath]
    return resource !== undefined && resource.some(actionHasCreateOrUpdate)
  }

  return (
    <div className='project-submission'>
      <h2 className='project-submission__title'>{props.project}</h2>
      {
        <Link className='project-submission__link' to={`/${props.project}/search`}>browse nodes</Link>
      }
      {
        (useArboristUI && !userHasCreateOrUpdateForThisProject()) ? null :
          <MySubmitForm />
      }
      {
        (useArboristUI && !userHasCreateOrUpdateForThisProject()) ? null :
          <MySubmitTSV project={props.project} />
      }
      { displayData() }
    </div>
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
