import { connect } from 'react-redux';

import { fetchWithCreds, updatePopup } from '../actions';
import { getSubmitPath } from '../utils';
import { submissionApiPath } from '../localconf';
import QueryNode from './QueryNode';
import {
  clearDeleteSession,
  deleteErrored,
  deleteSucceded,
  receiveQueryNode,
  receiveSearchEntities,
  storeNodeInfo,
} from './actions';

/** @typedef {import('redux').Dispatch} Dispatch */
/** @typedef {import('./types').QueryNodeState} QueryNodeState */
/** @typedef {import('../types').PopupState} PopupState */
/** @typedef {import('../Submission/types').SubmissionState} SubmissionState */

/**
 * @param {any} opts
 * @param {Function} [cb]
 */
export const submitSearchForm =
  (opts, cb) => (/** @type {Dispatch} */ dispatch) => {
    const nodeType = opts.node_type;
    const submitterId = opts.submitter_id || '';

    return fetchWithCreds({
      path: `${submissionApiPath}graphql`,
      body: JSON.stringify({
        query: `query Test { ${nodeType} (first: 20, project_id: "${opts.project}", quick_search: "${submitterId}", order_by_desc: "updated_datetime") {id, type, submitter_id}}`,
      }),
      method: 'POST',
      dispatch,
    })
      .then(({ status, data }) => {
        switch (status) {
          case 200:
            return receiveSearchEntities({
              search_result: data,
              search_status: `succeed: ${status}`,
            });
          default:
            return receiveSearchEntities({
              search_result: data,
              search_status: `failed: ${status}`,
            });
        }
      })
      .then((msg) => dispatch(msg))
      .then(() => cb?.());
  };

/** @param {{ project: string; id: string; }} param */
const deleteNode =
  ({ id, project }) =>
  (/** @type {Dispatch} */ dispatch) =>
    fetchWithCreds({
      path: `${getSubmitPath(project)}/entities/${id}`,
      method: 'DELETE',
      dispatch,
    }).then(({ status, data }) => {
      // console.log('receive delete');
      dispatch(updatePopup({ nodedelete_popup: false, view_popup: false }));

      switch (status) {
        case 200:
          dispatch(deleteSucceded(id));
          return dispatch(clearDeleteSession());
        default:
          return dispatch(deleteErrored(data));
      }
    });

/** @param {{ project: string; id: string; }} param */
const fetchQueryNode =
  ({ id, project }) =>
  (/** @type {Dispatch} */ dispatch) =>
    fetchWithCreds({
      path: `${getSubmitPath(project)}/export?ids=${id}&format=json`,
      dispatch,
    }).then(({ status, data }) => {
      switch (status) {
        case 200:
          return dispatch(receiveQueryNode(data[0]));
        default:
          return null;
      }
    });

/**
 *
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
    dispatch(fetchQueryNode({ id, project })).then(() =>
      dispatch(storeNodeInfo(id))
    ),
});
const ReduxQueryNode = connect(mapStateToProps, mapDispatchToProps)(QueryNode);
export default ReduxQueryNode;
