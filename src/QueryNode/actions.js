import { fetchWrapper, updatePopup } from '../actions';
import { push } from 'react-router-redux';
import { get_submit_path } from '../utils';
import { submissionapi_path, submissionapi_oauth_path } from '../localconf';
import { getCounts } from '../DataModelGraph/component';

export const updateSearchForm = (value) => {
  return {
    type: 'UPDATE_SEARCH_FORM',
    form: value
  }
};


export const submitSearchForm = ({node_type, submitter_id="", project}, url) => {
  return (dispatch) => dispatch(fetchWrapper({
    path: submissionapi_path + 'graphql',
    body: JSON.stringify({
      'query': `query Test { ${node_type} (first: 100000, project_id: \"${project}\", quick_search: \"${submitter_id}\") {id, type, submitter_id}}`
    }),
    method: 'POST',
    handler: receiveSearchEntities
  })).then(() => {
    if (url) { return dispatch(push(url))}
    else {return }});
};

export const receiveSearchEntities = ({status, data}) => {
  switch (status) {
    case 200:
      return {
        type: 'RECEIVE_SEARCH_ENTITIES',
        search_status: 'succeed: ' + status,
        data: data
      };
    default:
      return {
        type: 'RECEIVE_SEARCH_ENTITIES',
        search_status: 'failed: ' + status,
        data: data
      }
  }
};

export const deleteNode = ({id, project}) => {
  let receiveDelete = ({status, data}) => {
    console.log('receive delete');
    return receiveDeleteResponse({status, data, id, project})
  };
  return fetchWrapper({
    path: get_submit_path(project) + '/' + 'entities/' + id,
    method: 'DELETE',
    handler: receiveDelete
  })
};

export const receiveDeleteResponse = ({status, data, id, project}) => {
  return (dispatch) => {
    switch (status) {
      case 200:
        dispatch({
          type: 'DELETE_SUCCEED',
          id: id
        });
        dispatch(updatePopup({nodedelete_popup: false}));
        return dispatch(clearDeleteSession());

      default:
        return dispatch({
          type: 'DELETE_FAIL',
          id: id,
          error: data
        });
    }
  }
};

export const storeNodeInfo = ({id}) => {
  return {
    type: 'STORE_NODE_INFO',
    id: id
  }
};

export const fetchQueryNode = ({id, project}) => {
  return fetchWrapper({
    path: get_submit_path(project) + '/' + 'export?ids=' + id + '&format=json',
    handler: receiveQueryNode
  })
};

export const receiveQueryNode = ({status, data}) => {
  switch (status) {
    case 200:
      return {
        type: 'RECEIVE_QUERY_NODE',
        data: data[0]
      };
    default:
      return {
        type: 'QUERY_ERROR',
        error: data
      }
  }
};

export const clearDeleteSession = () => {
  return {
    type: 'CLEAR_DELETE_SESSION'
  }
};

export const clearResultAndQuery = (nextState) => {
  return (dispatch, getState) => {
    dispatch(
    {type: 'CLEAR_QUERY_NODES'}
    )
    let location = getState().routing.locationBeforeTransitions;
    if (Object.keys(location.query).length > 0){
      dispatch(
        submitSearchForm({project:nextState.params.project, ...location.query})
      );
    }
  }
};
