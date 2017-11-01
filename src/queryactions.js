import { fetchJsonOrText } from './actions';
import { submissionApiPath } from './localconf';

// import { setFooterDefaults } from './components/Footer';

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


export const fetchDictionary = () => dispatch =>
  fetchJsonOrText({
    path: `${submissionApiPath}_dictionary/_all`,
    method: 'GET',
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
    .then(msg => dispatch(msg))
    //Go AND FETCH THE DICITONARY VERSION INFO ...
    .then(() => {
      fetchJsonOrText( { path: `${apiPath}_version`, method: 'GET', } ).then( ({status, data}) => {
        if (status == 200) {
          setFooterDefaults( { dictionaryVersion: data.dictionary.version, apiVersion: data.version } );
        }
      } )
    });


export const fetchNodeTypes = () => dispatch =>
  fetchJsonOrText({
    path: `${submissionApiPath}_dictionary`,
    method: 'GET',
  })
    .then(
      ({ status, data }) => {
        switch (status) {
        case 200:
          return {
            type: 'RECEIVE_NODE_TYPES',
            data: data.links.map(link => link.split('/').pop()),
          };
        default:
          return {
            type: 'FETCH_ERROR',
            error: data,
          };
        }
      })
    .then(msg => dispatch(msg));
