import { fetchJsonOrText } from './actions';
import { apiPath, graphqlSchemaUrl, submissionApiPath } from './localconf';
import Footer from './components/Footer';

/*
 * redux-thunk support asynchronous redux actions via 'thunks' -
 * lambdas that accept dispatch and getState functions as arguments
 */

export const fetchProjects = () => dispatch =>
  fetchJsonOrText({
    path: `${submissionApiPath}graphql`,
    body: JSON.stringify({
      query: 'query Test { project(first:10000) {code, project_id}}',
    }),
    method: 'POST',
  })
    .then(
      ({ status, data }) => {
        switch (status) {
        case 200:
          return {
            type: 'RECEIVE_PROJECTS',
            data: data.data.project,
          };
        default:
          return {
            type: 'FETCH_ERROR',
            error: data,
          };
        }
      })
    .then(msg => dispatch(msg));


/**
 * Fetch the schema for graphi, and stuff it into redux -
 * handled by router
 */
export const fetchSchema = dispatch => fetchJsonOrText({ path: graphqlSchemaUrl, dispatch })
.then(
  ({ status, data }) => {
    switch (status) {
    case 200:
      return dispatch(
        {
          type: 'RECEIVE_SCHEMA_LOGIN',
          schema: data,
        },
      );
    }
  },
);


export const fetchDictionary = dispatch => 
  fetchJsonOrText({
        path: `${submissionApiPath}_dictionary/_all`,
        method: 'GET',
        useCache: true,
      })
    .then(
      ({ status, data }) => {
        switch (status) {
        case 200:
          return {
            type: 'RECEIVE_DICTIONARY',
            data,
          };
        default:
          return {
            type: 'FETCH_ERROR',
            error: data,
          };
        }
      })
    .then(msg => dispatch(msg));


export const fetchVersionInfo = () =>
  fetchJsonOrText({ path: `${apiPath}_version`, method: 'GET', useCache: true })
    .then(({ status, data }) => {
      if (status === 200) {
        Object.assign(Footer.defaultProps,
          { dictionaryVersion: data.dictionary.version,
            apiVersion: data.version },
        );
      } 
      return { status, data };
    });
