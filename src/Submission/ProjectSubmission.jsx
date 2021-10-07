import React from 'react';
import { Link, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import ReduxDataModelGraph from '../DataModelGraph/ReduxDataModelGraph';
import ReduxSubmitForm from './ReduxSubmitForm';
import ReduxSubmitTSV from './ReduxSubmitTSV';
import Spinner from '../components/Spinner';
import './ProjectSubmission.less';

/**
 * @param {Object} props
 * @param {Object} [props.dictionary]
 * @param {(typeList: string[], project: string, dictionary: Object) => void} props.onGetCounts
 * @param {boolean} [props.dataIsReady]
 * @param {string[]} [props.typeList]
 */
function ProjectSubmission({
  dictionary,
  onGetCounts,
  dataIsReady = false,
  typeList = [],
}) {
  if (dictionary === undefined) return <Spinner />;

  const { project } = useParams();
  // hack to detect if dictionary data is available, and to trigger fetch if not
  if (!dataIsReady) onGetCounts(typeList, project, dictionary);

  return (
    <div className='project-submission'>
      <h2 className='project-submission__title'>{project}</h2>
      <Link className='project-submission__link' to={`/${project}/search`}>
        browse nodes
      </Link>
      <ReduxSubmitForm />
      <ReduxSubmitTSV project={project} />
      {dataIsReady ? (
        <ReduxDataModelGraph project={project} />
      ) : (
        project !== '_root' && <Spinner />
      )}
    </div>
  );
}

ProjectSubmission.propTypes = {
  dictionary: PropTypes.object,
  onGetCounts: PropTypes.func.isRequired,
  dataIsReady: PropTypes.bool,
  typeList: PropTypes.arrayOf(PropTypes.string),
};

export default ProjectSubmission;
