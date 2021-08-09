import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Space } from 'antd';
import SubmitTSV from './SubmitTSV';
import DataModelGraph from '../DataModelGraph/DataModelGraph';
import SubmitForm from './SubmitForm';
import Spinner from '../components/Spinner';
import './ProjectSubmission.less';
import { useArboristUI } from '../configs';
import {
  userHasMethodForServiceOnProject,
  isRootUrl,
  isProgramUrl,
  userHasSheepdogProgramAdmin,
  userHasSheepdogProjectAdmin,
} from '../authMappingUtils';

class ProjectSubmission extends React.Component {
  componentDidMount() {
    this.props.fetchPrograms();
  }

  componentDidUpdate() {
    if (this.props.programList && !this.shouldDisplayProjectUIComponents(
      this.props.project,
      this.props.projectList,
      this.props.programList,
      this.props.userAuthMapping,
    )) {
      this.props.history.push('/not-found');
    }
  }

  shouldDisplayProjectUIComponents = (
    project,
    projectList,
    programList,
    userAuthMapping,
  ) => {
    if (useArboristUI) {
      // check against arborist policies
      return ((isRootUrl(project) && userHasSheepdogProgramAdmin(userAuthMapping))
        || (isProgramUrl(project)
        && programList.includes(project)
        && userHasSheepdogProjectAdmin(userAuthMapping))
        || Object.values(projectList).includes(project));
    }
    return (
      // if arborist UI is disabled, fallback to simple checks
      // 1. if url is root
      // 2. if program exists
      // 3. if project exists and user has access
      isRootUrl(project)
      || programList.includes(project)
      || Object.values(projectList).includes(project));
  };

  render() {
  // hack to detect if dictionary data is available, and to trigger fetch if not
    if (!this.props.dataIsReady) {
      this.props.onGetCounts(this.props.typeList, this.props.project, this.props.dictionary);
    }

    // if the fetchPrograms call has not finished, just wait with a spinner
    if (!this.props.programList) {
      return <Spinner />;
    }

    // Passing children in as props allows us to swap in different containers -
    // dumb, redux, ...
    const MySubmitForm = this.props.submitForm;
    const MySubmitTSV = this.props.submitTSV;
    const MyDataModelGraph = this.props.dataModelGraph;
    const displayData = () => {
      if (!this.props.dataIsReady) {
        if (this.props.project !== '_root') {
          return <Spinner />;
        }
        return null;
      }
      return <MyDataModelGraph project={this.props.project} />;
    };

    const displaySubmissionUIComponents = (project, userAuthMapping) => {
      if (
        !useArboristUI
        || (isRootUrl(project) && userHasSheepdogProgramAdmin(userAuthMapping))
        || (isProgramUrl(project) && userHasSheepdogProjectAdmin(userAuthMapping))
        || userHasMethodForServiceOnProject('create', 'sheepdog', project, userAuthMapping)
        || userHasMethodForServiceOnProject('update', 'sheepdog', project, userAuthMapping)
      ) {
        return (
          <React.Fragment>
            <Space direction='vertical' style={{ width: '100%' }}>
              <MySubmitForm />
              <MySubmitTSV project={project} />
            </Space>
          </React.Fragment>
        );
      }
      return null;
    };

    return (
      <div className='project-submission'>
        <h2 className='project-submission__title'>{this.props.project}</h2>
        {
          <Link
            className='project-submission__link'
            to={`/${this.props.project}/search`}
          >browse nodes
          </Link>
        }
        { displaySubmissionUIComponents(this.props.project, this.props.userAuthMapping) }
        { displayData() }
      </div>
    );
  }
}

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
  projectList: PropTypes.object,
  programList: PropTypes.array,
  fetchPrograms: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

ProjectSubmission.defaultProps = {
  dataIsReady: false,
  submitForm: SubmitForm,
  submitTSV: SubmitTSV,
  dataModelGraph: DataModelGraph,
  typeList: [],
  projectList: {},
  programList: undefined,
};

export default withRouter(ProjectSubmission);
