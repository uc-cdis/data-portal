import _ from 'underscore';
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

const getProjectNodeCounts = async (callback) => {
  const resultStatus = { needLogin: false };
  if (typeof homepageChartNodes === 'undefined') {
    getProjectsList();
    if (callback) {
      callback(resultStatus);
    }
    return;
  }

  const store = await getReduxStore();
  const fileNodes = store.getState().submission.file_nodes;
  const nodesForIndexChart = homepageChartNodes.map(item => item.node);
  const nodesToRequest = _.union(fileNodes, nodesForIndexChart);
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

export default getProjectNodeCounts;
