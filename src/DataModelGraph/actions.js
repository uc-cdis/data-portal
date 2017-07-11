import { fetchWrapper } from '../actions';
import { submissionapi_path } from '../localconf';

export const getCounts = (type, project) => {
  let query = "{";
  function append_to_query(element) {
    if (element !== "metaschema" && !element.startsWith('_')) {
      query = query + `_${element}_count (project_id:\"${project}\"),`;
    }
  }
  type.forEach((element) => {
    if (element != "program") {
      append_to_query(element);
    }
  });
  query = query.concat("}");
  return fetchWrapper({
    path: submissionapi_path + 'graphql',
    body: JSON.stringify({
      'query': query 
    }),
    method: 'POST',
    handler: receiveCounts
  });
}

export const clearCounts = () => {
  return {
    type: 'CLEAR_COUNTS'
  }
}

let receiveCounts = ({status, data}) => {
  switch (status){
    case 200:
      return {
        type: 'RECEIVE_COUNTS',
        data: data.data
      };
    default:
      return {
        type: 'FETCH_ERROR',
        error: data.data
      }
  }
};
