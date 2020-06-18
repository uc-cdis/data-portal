import _ from 'underscore';
import { fetchWithCreds } from '../actions';
import { homepageChartNodes, datasetUrl } from '../localconf';
import getReduxStore from '../reduxStore';
import getHomepageChartProjectsList from './relayer';

const updateRedux = async projectNodeCounts => getReduxStore().then(
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
  },
);

// Chunk into groups of 15
// Chunking is necessary to avoid hitting Postgres limits
export const getChunkedPeregrineRequestUrls = (nodesToRequest) => {
  let requestUrls = [];

  let k = 0;
  let chunkSize = 15;
  let n = nodesToRequest.length;

  if(n == 0) {
    return [`${datasetUrl}?nodes=`];
  }
  
  while(k < n) {
    let listRightBound = Math.min(k + chunkSize, n)
    let nodeChunk = nodesToRequest.slice(k, listRightBound);
    let chunkRequestUrl = `${datasetUrl}?nodes=${nodeChunk.join(',')}`;
    requestUrls.push(chunkRequestUrl);
    k = k + chunkSize;

  }

  return requestUrls;
}

const makePeregrineRequestForNode = async (url) => {
  return fetchWithCreds({
    path: url,
  }).then((res) => {
    if(res.status == 200) {
      return [res.data, 200];
    }
    return [null, res.status];
    // switch (res.status) {

    // case 200:
    //   // updateRedux(res.data);
    //   // if (callback) {
    //   //   callback(resultStatus);
    //   // }
    //   return [res.data, 200];
    //   break;
    // case 404:
    //   // Shouldn't happen, this means peregrine datasets endpoint not enabled
    //   // console.error(`REST endpoint ${datasetUrl} not enabled in Peregrine yet.`);
    //   // resultStatus.needLogin = true;
    //   // if (callback) {
    //   //   callback(resultStatus);
    //   // }
    //   return [null, 404];
    //   break;
    // case 401:
    //   return [null, 401];
    //   break;
    // case 403:
    //   // resultStatus.needLogin = true;
    //   // if (callback) {
    //   //   callback(resultStatus);
    //   // }
    //   return [null, 403];
    //   break;
    // default:
    //   break;
    // }
  })
    .catch((err) => {
      console.log(err);
    });
}

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
  const nodesForIndexChart = homepageChartNodes.map(item => item.node);
  const nodesToRequest = _.union(fileNodes, nodesForIndexChart);
  const requestUrls = getChunkedPeregrineRequestUrls(nodesToRequest);

  let fullResult = [];
  for (let k = 0; k < requestUrls.length; k+=1) {
    let chunkResult = await makePeregrineRequestForNode(requestUrls[k]);
    fullResult.append(chunkResult);
    console.log(chunkResult);
  }

  console.log('fullResult: ', fullResult);
};

// loadHomepageChartDataFromGraphQL will load the same data as the
// loadHomepageChartsFromDatasets function above, but will do it through
// multiple queries to Peregrine's GraphQL endpoint instead.
export const loadHomepageChartDataFromGraphQL = () => {
  getHomepageChartProjectsList();
};
