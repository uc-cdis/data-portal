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

const getProjectNodeCounts = async () => {
  if (typeof homepageChartNodes === 'undefined') {
    getProjectsList();
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
    if (res.status === 200) {
      updateRedux(res.data);
    } else if (res.status === 404) {
      console.error(`REST endpoint ${datasetUrl} not enabled in Peregrine yet.`);
      getProjectsList();
    }
  })
    .catch((err) => {
      console.log(err);
    });
};

export default getProjectNodeCounts;
