import { connect } from 'react-redux';
import MapDataModel from './MapDataModel';

const ReduxMapDataModel = (() => {
  const mapStateToProps = state => ({
    filesToMap: state.submission.filesToMap,
    projects: state.homepage.projectsByName,
    nodeTypes: state.submission.nodeTypes,
    dictionary: state.submission.dictionary,
  });

  const mapDispatchToProps = () => ({
  });

  return connect(mapStateToProps, mapDispatchToProps)(MapDataModel);
})();

export default ReduxMapDataModel;
