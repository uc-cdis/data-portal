import { fetchWithCreds } from '../actions';
import { guppyDownloadUrl } from '../localconf';
import getReduxStore from '../reduxStore';
import { consortiumList } from '../params';

const fetchOpts = {
  path: guppyDownloadUrl,
  method: 'POST',
  body: JSON.stringify({
    type: 'subject',
    fields: ['consortium', 'study_id', '_molecular_analysis_count'],
  }),
  customHeaders: {
    Accept: 'application/json',
    Signature: 'signature token',
  },
};

export function getIndexPageCounts() {
  getReduxStore().then(
    (store) => {
      const { updatedAt } = store.getState().index;
      const needsUpdate =
        updatedAt === undefined || Date.now() - updatedAt > 300000;

      if (needsUpdate)
        fetchWithCreds(fetchOpts).then(({ data, response }) => {
          if (response.status === 200) {
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

function parseCounts(rawData) {
  const data = [];
  for (const { consortium, study_id, _molecular_analysis_count } of rawData)
    data.push({
      consortium,
      molecular_analysis_count: _molecular_analysis_count,
      study_id,
    });

  const totalCounts = getCountObject(data);
  const summaryCounts = {
    0: totalCounts.subject,
    1: totalCounts.study,
    2: totalCounts.molecular_analysis,
  };

  const projectsByName = {};
  const overviewCounts = { total: totalCounts, names: consortiumList };
  for (const consortium of consortiumList) {
    const consortiumCounts = getCountObject(data, consortium);
    projectsByName[consortium] = {
      code: consortium,
      name: consortium,
      counts: [
        consortiumCounts.subject,
        consortiumCounts.study,
        consortiumCounts.molecular_analysis,
      ],
    };
    overviewCounts[consortium] = consortiumCounts;
  }

  return {
    countNames: ['Subjects', 'Studies', 'Molecular Analyses'],
    summaryCounts,
    projectsByName,
    overviewCounts,
  };
}
function getCountObject(data, whichConsortium) {
  let molecularAnalysisCount = 0;
  let studySet = new Set();
  let subjectCount = whichConsortium === undefined ? data.length : 0;

  for (const { consortium, study_id, molecular_analysis_count } of data)
    if (whichConsortium === undefined) {
      molecularAnalysisCount += molecular_analysis_count;
      for (const id of study_id) studySet.add(id);
    } else if (whichConsortium === consortium) {
      molecularAnalysisCount += molecular_analysis_count;
      for (const id of study_id) studySet.add(id);
      subjectCount++;
    }

  return {
    molecular_analysis: molecularAnalysisCount,
    study: studySet.size,
    subject: subjectCount,
  };
}
