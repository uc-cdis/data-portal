import { push } from 'react-router-redux';
import { fetchWrapper, updatePopup } from '../actions';
import { getSubmitPath } from '../utils';
import { submissionApiPath } from '../localconf';

export const updateSearchForm = value => ({
  type: 'UPDATE_SEARCH_FORM',
  form: value,
});


export const submitSearchForm = ({ node_type, submitter_id = '', project }, url) => dispatch => dispatch(fetchWrapper({
  path: `${submissionApiPath}graphql`,
  body: JSON.stringify({
    query: `query Test { ${node_type} (first: 100000, project_id: \"${project}\", quick_search: \"${submitter_id}\") {id, type, submitter_id}}`,
  }),
  method: 'POST',
  handler: receiveSearchEntities,
})).then(() => {
  if (url) { return dispatch(push(url)); }
});

export const receiveSearchEntities = ({ status, data }) => {
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
};

export const deleteNode = ({ id, project }) => {
  const receiveDelete = ({ status, data }) => {
    console.log('receive delete');
    return receiveDeleteResponse({ status, data, id, project });
  };
  return fetchWrapper({
    path: `${getSubmitPath(project)}/` + `entities/${id}`,
    method: 'DELETE',
    handler: receiveDelete,
  });
};

export const receiveDeleteResponse = ({ status, data, id, project }) => (dispatch) => {
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
};

export const storeNodeInfo = ({ id }) => ({
  type: 'STORE_NODE_INFO',
  id,
});

export const fetchQueryNode = ({ id, project }) => fetchWrapper({
  path: `${getSubmitPath(project)}/` + `export?ids=${id}&format=json`,
  handler: receiveQueryNode,
});

export const receiveQueryNode = ({ status, data }) => {
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
};

export const clearDeleteSession = () => ({
  type: 'CLEAR_DELETE_SESSION',
});

export const clearResultAndQuery = nextState => (dispatch, getState) => {
  dispatch(
    { type: 'CLEAR_QUERY_NODES' },
  );
  const location = getState().routing.locationBeforeTransitions;
  if (Object.keys(location.query).length > 0) {
    dispatch(
      submitSearchForm({ project: nextState.params.project, ...location.query }),
    );
  }
};
