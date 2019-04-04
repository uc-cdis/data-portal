import { connect } from 'react-redux';

import { fetchWithCreds, updatePopup } from '../actions';
import { getSubmitPath } from '../utils';
import { submissionApiPath } from '../localconf';
import QueryNode from './QueryNode';


const clearDeleteSession = {
  type: 'CLEAR_DELETE_SESSION',
};

export const submitSearchForm = (opts, url, history) =>
  (dispatch) => {
    const nodeType = opts.node_type;
    const submitterId = opts.submitter_id || '';
    const project = opts.project;

    return fetchWithCreds({
      path: `${submissionApiPath}graphql`,
      body: JSON.stringify({
        query: `query Test { ${nodeType} (first: 20, project_id: "${project}", quick_search: "${submitterId}", order_by_desc: "updated_datetime") {id, type, submitter_id}}`,
      }),
      method: 'POST',
      dispatch,
    })
      .then(
        ({ status, data }) => {
          switch (status) {
          case 200:
            return {
              type: 'RECEIVE_SEARCH_ENTITIES',
              search_status: `succeed: ${status}`,
              data,
            };
          default:
            return {
              type: 'RECEIVE_SEARCH_ENTITIES',
              search_status: `failed: ${status}`,
              data,
            };
          }
        },
      )
      .then(
        msg => dispatch(msg),
      )
      .then(
        () => {
          if (url && history) { history.push(url); }
          return null;
        },
      );
  };

const deleteNode = ({ id, project }) =>
  dispatch =>
    fetchWithCreds({
      path: `${getSubmitPath(project)}/entities/${id}`,
      method: 'DELETE',
      dispatch,
    })
      .then(
        ({ status, data }) => {
        // console.log('receive delete');
          dispatch(updatePopup({ nodedelete_popup: false, view_popup: false }));

          switch (status) {
          case 200:
            dispatch({
              type: 'DELETE_SUCCEED',
              id,
            });
            return dispatch(clearDeleteSession());
          default:
            return dispatch({
              type: 'DELETE_FAIL',
              id,
              error: data,
            });
          }
        },
      );

const storeNodeInfo = ({ id }) => ({
  type: 'STORE_NODE_INFO',
  id,
});

const fetchQueryNode = ({ id, project }) =>
  dispatch =>
    fetchWithCreds({
      path: `${getSubmitPath(project)}/export?ids=${id}&format=json`,
      dispatch,
    })
      .then(
        ({ status, data }) => {
          switch (status) {
          case 200:
            return {
              type: 'RECEIVE_QUERY_NODE',
              data: data[0],
            };
          default:
            return {
              type: 'QUERY_ERROR',
              error: data,
            };
          }
        },
      ).then((msg) => { dispatch(msg); });


const mapStateToProps = (state, ownProps) => {
  const result = {
    submission: state.submission,
    ownProps,
    queryNodes: state.queryNodes,
    popups: Object.assign({}, state.popups),
  };
  return result;
};

const mapDispatchToProps = dispatch => ({
  onSearchFormSubmit: (value, url, history) => dispatch(submitSearchForm(value, url, history)),
  onUpdatePopup: state => dispatch(updatePopup(state)),
  onClearDeleteSession: () => dispatch(clearDeleteSession),
  onDeleteNode: ({ id, project }) => {
    dispatch(deleteNode({ id, project }));
  },
  onStoreNodeInfo: ({ id, project }) =>
    dispatch(fetchQueryNode({ id, project }))
      .then(() => dispatch(storeNodeInfo({ id }))),
});
const ReduxQueryNode = connect(mapStateToProps, mapDispatchToProps)(QueryNode);
export default ReduxQueryNode;
