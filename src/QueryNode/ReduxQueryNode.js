import { connect } from 'react-redux';
import { updatePopup } from '../actions';
import QueryNode from './QueryNode';
import { clearDeleteSession, storeNodeInfo } from './actions';
import { deleteNode, fetchQueryNode, submitSearchForm } from './actions.thunk';

/** @typedef {import('redux-thunk').ThunkDispatch} ThunkDispatch */
/** @typedef {import('./types').QueryNodeState} QueryNodeState */
/** @typedef {import('../types').PopupState} PopupState */
/** @typedef {import('../Submission/types').SubmissionState} SubmissionState */

/**
 * @param {Object} state
 * @param {PopupState} state.popups
 * @param {QueryNodeState} state.queryNodes
 * @param {SubmissionState} state.submission
 */
const mapStateToProps = (state) => ({
  submission: state.submission,
  queryNodes: state.queryNodes,
  popups: state.popups,
});

/** @param {ThunkDispatch} dispatch */
const mapDispatchToProps = (dispatch) => ({
  /**
   * @param {any} value
   * @param {Function} [cb]
   */
  onSearchFormSubmit: (value, cb) => {
    dispatch(submitSearchForm(value, cb));
  },
  /** @param {{ nodedelete_popup?: PopupState['nodedelete_popup']; view_popup?: PopupState['view_popup'] }} state */
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
  /**
   * @param {{ project: string; id: string; }} param
   * @returns {Promise<void>}
   */
  onStoreNodeInfo: ({ id, project }) =>
    dispatch(fetchQueryNode({ id, project })).then(() => {
      dispatch(storeNodeInfo(id));
    }),
});
const ReduxQueryNode = connect(mapStateToProps, mapDispatchToProps)(QueryNode);
export default ReduxQueryNode;
