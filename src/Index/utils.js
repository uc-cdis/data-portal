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
  })
    .catch((err) => {
      console.log(err);
    });
}

export const mergeChunkedChartData = (chartDataArray) => {
  let mergedChartData = {};
  var projects;
  var projectKeys;
  for (let y = 0; y < chartDataArray.length; y += 1) {
    projects = chartDataArray[y][0];
    projectKeys = Object.keys(projects);

    for (let z = 0; z < projectKeys.length; z += 1) {
      if (mergedChartData[projectKeys[z]]) {
        let nodes = projects[projectKeys[z]];
        let nodeNames = Object.keys(nodes);
        for (let w = 0; w < nodeNames.length; w += 1) {
          mergedChartData[projectKeys[z]][nodeNames[w]] = nodes[nodeNames[w]];
        }
      } else {
        mergedChartData[projectKeys[z]] = projects[projectKeys[z]];
      }
    }
  }

  return mergedChartData;
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
  for (let k = 0; k < requestUrls.length; k += 1) {
    let chunkResult = await makePeregrineRequestForNode(requestUrls[k]);
    fullResult.push(chunkResult);
  }

  const queryFailure = fullResult.some((element) => element[1] !== 200);
  const query401 =  fullResult.some((element) => element[1] === 401);
  const query403 =  fullResult.some((element) => element[1] === 403);
  const query404 =  fullResult.some((element) => element[1] === 404);
  
  if(queryFailure) {
    if(query404) {
      // Shouldn't happen, this means peregrine datasets endpoint not enabled
      console.error(`REST endpoint ${datasetUrl} not enabled in Peregrine yet.`);
    }
    if(query401 || query403 || query404) {
      resultStatus.needLogin = true;
      if (callback) {
        return callback(resultStatus);
      }
    }
  }
  if(query401) {
    return;
  }

  let mergedChartData = mergeChunkedChartData(fullResult);
  console.log(fullResult);
  console.log(mergedChartData);

  updateRedux(mergedChartData);
  if (callback) {
    callback(resultStatus);
  }
};

// loadHomepageChartDataFromGraphQL will load the same data as the
// loadHomepageChartsFromDatasets function above, but will do it through
// multiple queries to Peregrine's GraphQL endpoint instead.
export const loadHomepageChartDataFromGraphQL = () => {
  getHomepageChartProjectsList();
};
