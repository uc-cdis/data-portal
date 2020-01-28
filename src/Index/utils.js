import { fetchWithCreds } from '../actions';
import { homepageChartNodes, datasetUrl } from '../localconf';
import getReduxStore from '../reduxStore';
import getProjectsList from './relayer';

const updateRedux = async projectNodeCounts => getReduxStore().then(
  (store) => {
    store.dispatch({
      type: 'RECEIVE_PROJECT_NODE_DATASETS',
      projectNodeCounts,
      homepageChartNodes,
      fileNodes: store.getState().submission.file_nodes,
    });
  },
  (err) => {
    console.error('WARNING: failed to load redux store', err);
    return 'ERR';
  },
);

export const loadProjectNodeCountsIntoRedux = async () => {
  getProjectsList();
};

// loadPeregrinePublicDatasetsIntoRedux queries Peregrine for the summary
// counts of the nodes in nodesToRequest and loads this data into Redux.
// NOTE this function requires `public_datasets: true` in the Peregrine config
// in order to display summary counts for all data in the homepage charts for
// users who are not logged in.
// (See https://github.com/uc-cdis/cdis-wiki/blob/0d828c73dcec7f37eba63ac453e56f1d4ce46d47/dev/gen3/guides/ui_etl_configuration.md)
export const loadPeregrinePublicDatasetsIntoRedux = async (nodesToRequest, callback) => {
  const resultStatus = { needLogin: false };

  const url = `${datasetUrl}?nodes=${nodesToRequest.join(',')}`;

  fetchWithCreds({
    path: url,
  }).then((res) => {
    switch (res.status) {
    case 200:
      updateRedux(res.data);
      if (callback) {
        callback(resultStatus);
      }
      break;
    case 404:
      // Shouldn't happen, this means peregrine datasets endpoint not enabled
      console.error(`REST endpoint ${datasetUrl} not enabled in Peregrine yet.`);
      if (callback) {
        callback(resultStatus);
      }
      break;
    case 401:
    case 403:
      resultStatus.needLogin = true;
      if (callback) {
        callback(resultStatus);
      }
      break;
    default:
      break;
    }
  })
    .catch((err) => {
      console.log(err);
    });
};
