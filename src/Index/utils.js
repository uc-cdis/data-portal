import { fetchWithCreds } from '../actions';
import { homepageChartNodes, datasetUrl } from '../localconf';
import getReduxStore from '../reduxStore';
import getHomepageChartProjectsList from './relayer';

const union = (a, b) => [...new Set([...a, ...b])];

const updateRedux = async (projectNodeCounts) =>
  getReduxStore().then(
    (store) => {
      store.dispatch({
        type: 'RECEIVE_HOMEPAGE_CHART_DATASETS',
        projectNodeCounts,
        homepageChartNodes,
        fileNodes: store.getState().submission.file_nodes,
      });
    },
    (err) => {
      console.error('WARNING: failed to load redux store', err);
      return 'ERR';
    }
  );

// loadHomepageChartdataFromDatasets queries Peregrine's /datasets endpoint for
// summary data (counts of projects, counts of subjects, etc).
// If `public_datasets` is enabled in Peregrine's config, the /datasets endpoint
// is publicly available, and can be accessed by logged-out users. Otherwise, the
// request will fail for logged-out users. If the request fails because the user
// is logged out, this function will return {needsLogin: true}.
export const loadHomepageChartDataFromDatasets = async (callback) => {
  const resultStatus = { needLogin: false };

  const store = await getReduxStore();
  const fileNodes = store.getState().submission.file_nodes;
  const nodesForIndexChart = homepageChartNodes.map((item) => item.node);
  const nodesToRequest = union(fileNodes, nodesForIndexChart);
  const url = `${datasetUrl}?nodes=${nodesToRequest.join(',')}`;

  fetchWithCreds({
    path: url,
  })
    .then((res) => {
      switch (res.status) {
        case 200:
          updateRedux(res.data);
          if (callback) {
            callback(resultStatus);
          }
          break;
        case 404:
          // Shouldn't happen, this means peregrine datasets endpoint not enabled
          console.error(
            `REST endpoint ${datasetUrl} not enabled in Peregrine yet.`
          );
          resultStatus.needLogin = true;
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

// loadHomepageChartDataFromGraphQL will load the same data as the
// loadHomepageChartsFromDatasets function above, but will do it through
// multiple queries to Peregrine's GraphQL endpoint instead.
export const loadHomepageChartDataFromGraphQL = () => {
  getHomepageChartProjectsList();
};
