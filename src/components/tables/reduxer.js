import { connect } from 'react-redux';
import ProjectTable from './ProjectTable';

const ReduxProjectTable = (() => {
  const mapStateToProps = state => {
    return {
      userAuthMapping: state.userAuthMapping,
    }
  };

  return connect(mapStateToProps)(ProjectTable);
})();

export default ReduxProjectTable;
