import { connect } from 'react-redux';
import ExplorerTable from '../ExplorerTable';

const mapStateToProps = state => ({
  userProjectAccess: state.user.project_access,
});

const mapDispatchToProps = () => ({
});

const ReduxExplorerTable = connect(mapStateToProps, mapDispatchToProps)(ExplorerTable);
export default ReduxExplorerTable;
