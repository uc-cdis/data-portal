import { fetchQuery } from 'relay-runtime';
import environment from '../environment';
import { GQLHelper } from '../gqlHelper';
import getReduxStore from '../reduxStore';
import { config } from '../params';

const gqlHelper = GQLHelper.getGQLHelper();

const updateRedux = async ({ projectList, summaryCounts }) => getReduxStore().then(
  (store) => {
    const indexState = store.getState().index || {};
    if (!indexState.projectsByName) {
      store.dispatch({ type: 'RECEIVE_HOMEPAGE_CHART_PROJECT_LIST', data: { projectList, summaryCounts } });
      return 'dispatch';
    }
    return 'NOOP';
  },
  (err) => {
    console.error('WARNING: failed to load redux store', err);
    return 'ERR';
  },
);

const updateReduxError = async (error) => getReduxStore().then(
  (store) => {
    store.dispatch({ type: 'RECEIVE_RELAY_FAIL', data: error });
  },
);

/**
 * Translate relay properties to {summaryCounts, projectList} structure
 * that is friendly to underlying components.
 *
 * @param data
 * @return {projectList, summaryCounts}
 */
const transformRelayProps = (data) => {
  const { fileCount } = GQLHelper.extractFileInfo(data);
  const nodeCount = Math.min(config.graphql.boardCounts.length + 1, 4);
  const projectList = (data.projectList || []).map(
    // fill in missing properties
    (proj) => ({
      name: 'unknown',
      counts: (new Array(nodeCount)).fill(0),
      charts: [0, 0],
      ...proj,
    }),

  );
  let summaryCounts = Object.keys(data).filter(
    (key) => key.indexOf('count') === 0).map((key) => key).sort()
    .map((key) => data[key],
    );
  if (summaryCounts.length < 4) {
    summaryCounts = [...summaryCounts, fileCount];
  }
  return {
    projectList,
    summaryCounts,
  };
};

const extractCounts = (data) => {
  const { fileCount } = GQLHelper.extractFileInfo(data);
  let counts = Object.keys(data).filter(
    (key) => key.indexOf('count') === 0).map((key) => key).sort()
    .map(
      (key) => data[key],
    );
  if (counts.length < 4) {
    counts = [...counts, fileCount];
  }
  return counts;
};

const extractCharts = (data) => Object.keys(data).filter(
  (key) => key.indexOf('chart') === 0)
  .map((key) => key).sort()
  .map(
    (key) => data[key],
  );

const updateProjectDetailToRedux = (projInfo) => {
  getReduxStore().then(
    (store) => {
      store.dispatch({ type: 'RECEIVE_HOMEPAGE_CHART_PROJECT_DETAIL', data: projInfo });
    },
  ).catch(
    (err) => {
      /* eslint no-console: ["error", { allow: ["error"] }] */
      console.error('WARNING: failed to load redux store', err);
    },
  );
};

const getProjectDetail = (projectList) => {
  projectList.forEach((project) => {
    fetchQuery(environment, gqlHelper.projectDetailQuery, { name: project.name })
      .then((data) => {
        const projInfo = {
          ...data.project[0],
          counts: extractCounts(data),
          charts: extractCharts(data),
        };
        updateProjectDetailToRedux(projInfo);
      });
  });
};

const checkIndexState = (stateName) => getReduxStore().then(
  (store) => {
    const indexState = store.getState().index || {};
    const nowMs = Date.now();
    if (!Object.prototype.hasOwnProperty.call(indexState, stateName)
        || (Object.prototype.hasOwnProperty.call(indexState, stateName)
          && nowMs - indexState[stateName] > 300000)
    ) {
      return 'OLD';
    }
    return 'FRESH';
  },
  (err) => {
    /* eslint no-console: ["error", { allow: ["error"] }] */
    console.error('WARNING: failed to load redux store', err);
    return 'ERR';
  },
);

const getHomepageChartProjectsList = () => {
  checkIndexState('lastestListUpdating').then(
    (res) => {
      if (res === 'OLD') {
        fetchQuery(environment, gqlHelper.homepageQuery, {})
          .then(
            (data) => {
              const { projectList, summaryCounts } = transformRelayProps(data);
              updateRedux({ projectList, summaryCounts })
                .then(() => getProjectDetail(projectList));
            },
            (error) => {
              updateReduxError(error);
            },
          );
      }
    },
    (error) => {
      updateReduxError(error);
    },
  );
};

export default getHomepageChartProjectsList;
