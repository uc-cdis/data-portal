import { connectionError, updatePopup } from '../actions';
import { fetchWithCreds } from '../actions.thunk';
import { getSubmitPath } from '../utils';
import { submissionApiPath } from '../localconf';
import {
  clearDeleteSession,
  deleteErrored,
  deleteSucceded,
  receiveQueryNode,
  receiveSearchEntities,
} from './actions';

/** @typedef {import('redux').Dispatch} Dispatch */
/** @typedef {import('./types').QueryNodeState} QueryNodeState */
/** @typedef {import('../types').PopupState} PopupState */
/** @typedef {import('../Submission/types').SubmissionState} SubmissionState */

/** @param {{ project: string; id: string; }} param */
export const deleteNode =
  ({ id, project }) =>
  async (/** @type {Dispatch} */ dispatch) => {
    const { data, status } = await fetchWithCreds({
      path: `${getSubmitPath(project)}/entities/${id}`,
      method: 'DELETE',
      onError: () => dispatch(connectionError()),
    });
    // console.log('receive delete');
    dispatch(updatePopup({ nodedelete_popup: false, view_popup: false }));

    if (status === 200) {
      dispatch(deleteSucceded(id));
      dispatch(clearDeleteSession());
    } else {
      dispatch(deleteErrored(data));
    }
  };

/** @param {{ project: string; id: string; }} param */
export const fetchQueryNode =
  ({ id, project }) =>
  async (/** @type {Dispatch} */ dispatch) => {
    const { data, status } = await fetchWithCreds({
      path: `${getSubmitPath(project)}/export?ids=${id}&format=json`,
      onError: () => dispatch(connectionError()),
    });

    if (status === 200) dispatch(receiveQueryNode(data[0]));
  };

/**
 * @param {any} opts
 * @param {Function} [cb]
 */
export const submitSearchForm =
  (opts, cb) => async (/** @type {Dispatch} */ dispatch) => {
    const nodeType = opts.node_type;
    const submitterId = opts.submitter_id || '';

    const { data, status } = await fetchWithCreds({
      path: `${submissionApiPath}graphql`,
      body: JSON.stringify({
        query: `query Test { ${nodeType} (first: 20, project_id: "${opts.project}", quick_search: "${submitterId}", order_by_desc: "updated_datetime") {id, type, submitter_id}}`,
      }),
      method: 'POST',
      onError: () => dispatch(connectionError()),
    });

    const payload = {
      search_result: data,
      search_status:
        status === 200 ? `succeed: ${status}` : `failed: ${status}`,
    };

    dispatch(receiveSearchEntities(payload));
    cb?.();
  };
