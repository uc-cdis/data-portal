import { connect } from 'react-redux';
import MapDataModel from './MapDataModel';
import { headers, submissionApiPath } from '../configs';

export const submitFiles = (program, project, params) => {
  const request = {
    credentials: 'include',
    headers: { ...headers },
    method: 'POST',
    body: JSON.stringify(params),
  };

  return fetch(`${submissionApiPath}${program}/${project}`, request)
    .then(response => response.text())
    .then((responseBody) => {
      try {
        return JSON.parse(responseBody);
      } catch (error) {
        return responseBody;
      }
    });
};

const ReduxMapDataModel = (() => {
  const mapStateToProps = state => ({
    filesToMap: state.submission.filesToMap,
    projects: state.homepage.projectsByName,
    nodeTypes: state.submission.nodeTypes,
    dictionary: state.submission.dictionary,
  });

  const mapDispatchToProps = () => ({
    submitFiles: (program, project, params) => submitFiles(program, project, params),
  });

  return connect(mapStateToProps, mapDispatchToProps)(MapDataModel);
})();

export default ReduxMapDataModel;
