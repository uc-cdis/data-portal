import { connect } from 'react-redux';
import DataModelGraph from './DataModelGraph';
import { createNodesAndEdges } from '../GraphUtils/utils';
import { fetchWithCreds } from '../actions';
import { submissionApiPath } from '../localconf';

/**
 * Compose and send a single graphql query to get a count of how
 * many of each node and edge are in the current state
 *
 * @param {string} project
 * async thunk action that fetches data from backend and updates redux when dispatched
 */
export const getCounts =
  (project) =>
  /**
   * @param {import('redux').Dispatch} dispatch
   * @param {() => { submission: import('../Submission/types').SubmissionState }} getState
   */
  (dispatch, getState) => {
    const { dictionary, nodeTypes } = getState().submission;
    function checkIfRelevantNode(name) {
      return (
        !name.startsWith('_') &&
        name !== 'program' &&
        name !== 'metaschema' &&
        dictionary[name].category !== 'internal'
      );
    }

    let query = '{';

    function appendCountToQuery(name) {
      query += `_${name}_count (project_id:"${project}"),`;
    }
    for (const name of nodeTypes)
      if (checkIfRelevantNode(name)) appendCountToQuery(name);

    function appendLinkToQuery({ name, source, target }) {
      if (name && target && target !== 'program')
        query += `${source}_${name}_to_${target}_link: ${source}(with_links: ["${name}"], first:1, project_id:"${project}"){submitter_id},`;
    }
    for (const [name, node] of Object.entries(dictionary))
      if (checkIfRelevantNode(name) && node.links)
        for (const link of node.links) {
          appendLinkToQuery({
            name: link.name,
            source: name,
            target: dictionary[link.target_type]?.id,
          });

          if (link.subgroup)
            for (const sLink of link.subgroup)
              appendLinkToQuery({
                name: sLink.name,
                source: name,
                target: dictionary[sLink.target_type]?.id,
              });
        }

    query = query.concat('}');

    return fetchWithCreds({
      path: `${submissionApiPath}graphql`,
      body: JSON.stringify({
        query,
      }),
      method: 'POST',
      dispatch,
    })
      .then(
        ({ status, data }) => {
          switch (status) {
            case 200:
              return {
                type: 'RECEIVE_COUNTS',
                data: data.data,
              };
            default:
              return {
                type: 'FETCH_ERROR',
                error: data.data,
              };
          }
        },
        (err) => ({ type: 'FETCH_ERROR', error: err })
      )
      .then((msg) => {
        dispatch(msg);
      });
  };

/** @param {{ submission: import('../Submission/types').SubmissionState }} state */
const mapStateToProps = (state) => {
  const props = {
    dictionary: state.submission.dictionary,
    counts_search: state.submission.counts_search,
    links_search: state.submission.links_search,
  };
  return {
    full: createNodesAndEdges(props, true),
    compact: createNodesAndEdges(props, false),
  };
};

const ReduxDataModelGraph = connect(mapStateToProps)(DataModelGraph);
export default ReduxDataModelGraph;
