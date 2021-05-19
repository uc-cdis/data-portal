import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import SubmitTSV from './SubmitTSV';
import DataModelGraph from '../DataModelGraph/DataModelGraph';
import SubmitForm from './SubmitForm';
import Spinner from '../components/Spinner';
import './ProjectSubmission.less';

/**
 *
 * @param {Object} props
 * @param {string} props.project
 * @param {Object} props.dictionary
 * @param {(typeList: string[], project: string, dictionary: Object) => void} props.onGetCounts
 * @param {boolean} [props.dataIsReady]
 * @param {string[]} [props.typeList]
 * @param {React.Component} [props.submitForm]
 * @param {React.Component} [props.submitTSV]
 * @param {React.Component} [props.dataModelGraph]
 */
function ProjectSubmission({
  project,
  dictionary,
  onGetCounts,
  dataIsReady = false,
  typeList = [],
  submitForm = SubmitForm,
  submitTSV = SubmitTSV,
  dataModelGraph = DataModelGraph,
}) {
  // hack to detect if dictionary data is available, and to trigger fetch if not
  if (!dataIsReady) onGetCounts(typeList, project, dictionary);

  // Passing children in as props allows us to swap in different containers -
  // dumb, redux, ...
  const MySubmitForm = submitForm;
  const MySubmitTSV = submitTSV;
  const MyDataModelGraph = dataModelGraph;

  return (
    <div className='project-submission'>
      <h2 className='project-submission__title'>{project}</h2>
      <Link className='project-submission__link' to={`/${project}/search`}>
        browse nodes
      </Link>
      <MySubmitForm />
      <MySubmitTSV project={project} />
      {dataIsReady ? (
        <MyDataModelGraph project={project} />
      ) : (
        project !== '_root' && <Spinner />
      )}
    </div>
  );
}

ProjectSubmission.propTypes = {
  project: PropTypes.string.isRequired,
  dictionary: PropTypes.object.isRequired,
  onGetCounts: PropTypes.func.isRequired,
  dataIsReady: PropTypes.bool,
  typeList: PropTypes.arrayOf(PropTypes.string),
  dataModelGraph: PropTypes.elementType,
  submitForm: PropTypes.elementType,
  submitTSV: PropTypes.elementType,
};

export default ProjectSubmission;
