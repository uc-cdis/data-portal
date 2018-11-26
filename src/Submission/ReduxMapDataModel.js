import { connect } from 'react-redux';
import MapDataModel from './MapDataModel';
import { fetchWithCreds } from '../actions';
import { indexdPath } from '../localconf';


const ReduxMapDataModel = (() => {
  const mapStateToProps = state => ({
    filesToMap: state.submission.filesToMap
  });

  const mapDispatchToProps = dispatch => ({
  });

  return connect(mapStateToProps, mapDispatchToProps)(MapDataModel);
})();

export default ReduxMapDataModel;
