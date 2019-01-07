import { connect } from 'react-redux';
import DataModelGraph from './DataModelGraph';

import { fetchWithCreds } from '../actions';
import { submissionApiPath } from '../localconf';

/**
 * Compose and send a single graphql query to get a count of how
 * many of each node and edge are in the current state
 *
 * @method getCounts
 * @param {Array<string>} typeList
 * @param {string} project
 * @param {Object} dictionary
 * @return {Function(dispatch => updates-redux-state)} async dispatch function
 *     that fetches data from backend and updates redux when dispatched
 */
export const getCounts = (typeList, project, dictionary) => {
  let query = '{';

  function appendCountToQuery(element) {
    const node = dictionary[element];
    if (element !== 'metaschema' && !element.startsWith('_') && node.category !== 'internal') {
      query += `_${element}_count (project_id:"${project}"),`;
    }
  }

  function appendLinkToQuery(source, dest, name) {
    if (source.id !== 'metaschema' && !source.id.startsWith('_') && source.category !== 'internal' && name != null && dest != null) {
      query += `${source.id}_${name}_to_${dest.id}_link: ${source.id}(with_links: ["${name}"], first:1, project_id:"${project}"){submitter_id},`;
    }
  }

  typeList.forEach((element) => {
    if (element !== 'program') {
      appendCountToQuery(element);
    }
  });

  const nodesToHide = { program: true };
  // Add links to query
  Object.keys(dictionary).filter(
    name => (!name.startsWith('_' && dictionary[name].links) && dictionary[name].category !== 'internal'),
  ).reduce( // extract links from each node
    (linkList, name) => {
      const node = dictionary[name];
      const newLinks = node.links;
      let results = linkList;
      if (newLinks) { // extract subgroups from each link
        const sgLinks = newLinks.reduce(
          (listlist, link) => {
            if (link.subgroup) {
              return link.subgroup.map(
                sg => ({
                  source: dictionary[name],
                  target: dictionary[sg.target_type],
                  name: sg.name,
                }),
              ).concat(listlist);
            }
            return listlist;
          }, [],
        );
        results = sgLinks.concat(linkList);
      }
      return newLinks ? newLinks.map(
        l => ({ source: dictionary[name], target: dictionary[l.target_type], name: l.name }),
      ).concat(results) : results;
    }, [],
  )
    .filter(
      l => l.source && l.target && !nodesToHide[l.source.id] && !nodesToHide[l.target.id],
    )
    .forEach(
      ({ source, target, name }) => appendLinkToQuery(source, target, name),
    );

  query = query.concat('}');

  return dispatch => fetchWithCreds({
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
      err => ({ type: 'FETCH_ERROR', error: err }),
    )
    .then((msg) => { dispatch(msg); });
};


const mapStateToProps = state => ({
  dictionary: state.submission.dictionary,
  counts_search: state.submission.counts_search,
  links_search: state.submission.links_search,
});

const mapDispatchToProps = dispatch => ({
  onGetCounts: (type, project) => dispatch(getCounts(type, project)),
});
const ReduxDataModelGraph = connect(mapStateToProps, mapDispatchToProps)(DataModelGraph);
export default ReduxDataModelGraph;
