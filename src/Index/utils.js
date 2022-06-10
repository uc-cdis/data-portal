import { fetchWithCreds } from '../actions.thunk';
import { consortiumList } from '../params';
import { receiveIndexPageCounts } from './actions';

/** @typedef {import('./types').IndexState} IndexState */
/** @typedef {import('./types').ConsortiumCountsData} ConsortiumCountsData */

/** @param {ConsortiumCountsData[]} data */
function parseCounts(data) {
  /** @type {IndexState['overviewCounts']} */
  const overviewCounts = { names: [], data: {} };
  /** @type {IndexState['projectList']} */
  const projectList = [];

  for (const {
    consortium,
    molecular_analysis: molecularAnalysis,
    study,
    subject,
  } of data) {
    if (subject > 0) {
      overviewCounts.data[consortium] = {
        molecular_analysis: molecularAnalysis,
        study,
        subject,
      };
      if (consortium !== 'total') {
        overviewCounts.names.push(consortium);

        projectList.push({
          code: consortium,
          counts: [subject, molecularAnalysis],
        });
      }
    }
  }

  return {
    countNames: ['Subjects', 'Molecular Analyses'],
    overviewCounts,
    projectList,
  };
}

// eslint-disable-next-line import/prefer-default-export
export function getIndexPageCounts() {
  /**
   * @param {import('redux').Dispatch} dispatch
   * @param {() => { index: import('./types').IndexState }} getState
   */
  return (dispatch, getState) => {
    const { updatedAt } = getState().index;
    const needsUpdate =
      updatedAt === undefined || Date.now() - updatedAt > 300000;

    if (needsUpdate)
      fetchWithCreds({
        path: '/analysis/tools/counts',
        method: 'POST',
        body: JSON.stringify({ consortiumList }),
      }).then(({ data, response, status }) => {
        if (status === 200) dispatch(receiveIndexPageCounts(parseCounts(data)));
        else
          console.error('WARNING: failed to with status', response.statusText);
      });
  };
}
