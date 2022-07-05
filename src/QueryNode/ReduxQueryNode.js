import { connect } from 'react-redux';
import { updatePopup } from '../redux/popups/slice';
import QueryNode from './QueryNode';
import {
  deleteNode,
  fetchQueryNode,
  submitSearchForm,
} from '../redux/queryNodes/asyncThunks';
import { clearDeleteSession, storeNodeInfo } from '../redux/queryNodes/slice';

/** @typedef {import('../redux/types').RootState} RootState */

/** @param {RootState} state */
const mapStateToProps = (state) => ({
  submission: state.submission,
  queryNodes: state.queryNodes,
  popups: state.popups,
});

/** @param {import('../redux/types').AppDispatch} dispatch */
const mapDispatchToProps = (dispatch) => ({
  /**
   * @param {Object} value
   * @param {Function} [callback]
   */
  onSearchFormSubmit: (value, callback) => {
    dispatch(submitSearchForm({ callback, ...value }));
  },
  /** @param {Partial<RootState['popups']>} state */
  onUpdatePopup: (state) => {
    dispatch(updatePopup(state));
  },
  onClearDeleteSession: () => {
    dispatch(clearDeleteSession);
  },
  /** @param {{ project: string; id: string; }} param */
  onDeleteNode: ({ id, project }) => {
    dispatch(deleteNode({ id, project }));
  },
  /** @param {{ project: string; id: string; }} param */
  onStoreNodeInfo: ({ id, project }) =>
    dispatch(fetchQueryNode({ id, project })).then(() => {
      dispatch(storeNodeInfo(id));
    }),
});
const ReduxQueryNode = connect(mapStateToProps, mapDispatchToProps)(QueryNode);
export default ReduxQueryNode;
