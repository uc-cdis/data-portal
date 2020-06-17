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

class ProjectSubmission extends React.Component {
  componentDidMount() {
    this.props.fetchPrograms();
  }

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

    const displaySubmissionForms = (project, userAuthMapping) => {
      if (!useArboristUI || userHasCreateOrUpdateMethodOnProject(project, userAuthMapping)) {
        return (
          <React.Fragment>
            <MySubmitForm />
            <MySubmitTSV project={project} />
          </React.Fragment>
        );
      }
      return null;
    };

    return (
      shouldDisplayProjectUIComponents(
        this.props.project,
        this.props.projectList,
        this.props.programList,
        this.props.userAuthMapping,
        useArboristUI,
      ) ?
        <div className='project-submission'>
          <h2 className='project-submission__title'>{this.props.project}</h2>
          {
            <Link
              className='project-submission__link'
              to={`/${this.props.project}/search`}
            >browse nodes</Link>
          }
          { displaySubmissionForms(this.props.project, this.props.userAuthMapping) }
          { displayData() }
        </div>
        :
        <NotFound />
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

export default ProjectSubmission;
