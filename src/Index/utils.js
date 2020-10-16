import { fetchWithCreds } from '../actions';
import { guppyDownloadUrl } from '../localconf';
import getReduxStore from '../reduxStore';
import { GQLHelper } from '../gqlHelper';

const consortiumList = GQLHelper.getConsortiumList();

export function getIndexPageOverviewData() {
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

  getReduxStore().then(
    (store) => {
      const { overviewCounts } = store.getState().index;
      const needsUpdate =
        overviewCounts === undefined ||
        Date.now() - overviewCounts.updatedAt > 300000;
      if (needsUpdate)
        fetchWithCreds(fetchOpts).then(({ data, response }) => {
          if (response.status === 200) {
            store.dispatch({
              type: 'RECEIVE_INDEX_PAGE_OVERVIEW_COUNTS',
              data: getCountsData(data),
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

function getCountsData(rawData) {
  const data = [];
  for (const { consortium, study_id, _molecular_analysis_count } of rawData)
    data.push({
      consortium,
      molecular_analysis_count: _molecular_analysis_count,
      study_id,
    });

  const counts = { total: getCountObject(data) };
  for (const consortium of consortiumList)
    counts[consortium] = getCountObject(data, consortium);

  return { ...counts, names: consortiumList };
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
