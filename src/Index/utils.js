import { fetchWithCreds } from '../actions';
import getReduxStore from '../reduxStore';
import { consortiumList } from '../params';

function parseCounts(data) {
  const overviewCounts = { names: [] };
  const projectList = [];

  for (const {
    consortium,
    molecular_analysis: molecularAnalysis,
    study,
    subject,
  } of data) {
    overviewCounts[consortium] = {
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

  return {
    countNames: ['Subjects', 'Molecular Analyses'],
    overviewCounts,
    projectList,
  };
}

// eslint-disable-next-line import/prefer-default-export
export function getIndexPageCounts() {
  getReduxStore().then(
    (store) => {
      const { updatedAt } = store.getState().index;
      const needsUpdate =
        updatedAt === undefined || Date.now() - updatedAt > 300000;

      if (needsUpdate)
        fetchWithCreds({
          path: '/analysis/tools/counts',
          method: 'POST',
          body: JSON.stringify({ consortiumList }),
        }).then(({ data, response, status }) => {
          if (status === 200) {
            store.dispatch({
              type: 'RECEIVE_INDEX_PAGE_COUNTS',
              data: parseCounts(data),
            });
          } else
            console.error(
              'WARNING: failed to with status',
              response.statusText
            );
        });
    },
    (err) => console.error('WARNING: failed to load redux store', err)
  );
}
