import { connect } from 'react-redux';
import ExplorerTable from '../ExplorerTable';
import { addToggleAll, addToggleOne, deselectAll } from './ExplorerTickBox/actions';

const mapStateToProps = state => ({
  selectingMode: state.tickbox.selectingMode,
  filteredItems: state.tickbox.filteredItems,
  allSelected: state.tickbox.allSelected
});

const mapDispatchToProps = dispatch => ({
  addToggleOne: (key, count) => dispatch(addToggleOne(key, count)),
  addToggleAll: () => dispatch(addToggleAll()),
  deselectAll: () => dispatch(deselectAll()),
});

const ReduxExplorerTable = connect(mapStateToProps, mapDispatchToProps)(ExplorerTable);
export default ReduxExplorerTable;
