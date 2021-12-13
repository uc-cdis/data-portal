import { connect } from 'react-redux';
import MapDataModel from './MapDataModel';
import { headers, submissionApiPath } from '../localconf';

export const submitFiles = (program, project, params) =>
  fetch(`${submissionApiPath}${program}/${project}`, {
    credentials: 'include',
    headers,
    method: 'POST',
    body: JSON.stringify(params),
  })
    .then((response) => response.text())
    .then((responseBody) => {
      try {
        return JSON.parse(responseBody);
      } catch (error) {
        return responseBody;
      }
    });

const ReduxMapDataModel = (() => {
  const mapStateToProps = (state) => ({
    filesToMap: state.submission.filesToMap,
    projects: state.submission.projectsByName,
    nodeTypes: state.submission.nodeTypes,
    dictionary: state.submission.dictionary,
  });

  const mapDispatchToProps = () => ({
    submitFiles: (program, project, params) =>
      submitFiles(program, project, params),
  });

  return connect(mapStateToProps, mapDispatchToProps)(MapDataModel);
})();

export default ReduxMapDataModel;
