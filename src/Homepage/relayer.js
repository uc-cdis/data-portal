import { fetchQuery, graphql } from 'relay-runtime';
import environment from '../environment';
import getReduxStore from '../reduxStore';
import { GQLHelper } from '../gqlHelper';
import { config } from '../params';

const updateReduxTransactionList = async (transactionList) => getReduxStore().then(
  (store) => {
    const homeState = store.getState().homepage || {};
    if (homeState) {
      store.dispatch({ type: 'RECEIVE_TRANSACTION_LIST', data: transactionList });
      return 'dispatch';
    }
    return 'NOOP';
  },
  () => {},
);

const updateReduxError = async (error) => getReduxStore().then(
  (store) => {
    store.dispatch({ type: 'RECEIVE_RELAY_FAIL', data: error });
  },
);

export const getTransactionList = () => {
  const query = graphql`query relayerTransactionLogComponentQuery {
      transactionList: transaction_log (last:20) {
          id
          submitter
          project_id
          created_datetime
          documents {
            doc_size
            doc
          }
          state
      }
  }`;
  fetchQuery(environment, query, {})
    .then(
      (data) => {
        const { transactionList } = data;
        updateReduxTransactionList(transactionList);
      },
      (error) => {
        updateReduxError(error);
      },
    );
};

const gqlHelper = GQLHelper.getGQLHelper();

const updateReduxProjectList = async ({ projectList, summaryCounts }) => getReduxStore().then(
  (store) => {
    const homeState = store.getState().homepage || {};
    if (!homeState.projectsByName) {
      store.dispatch({ type: 'RECEIVE_PROJECT_LIST', data: { projectList, summaryCounts } });
      return 'dispatch';
    }
    return 'NOOP';
  },
  (err) => {
    console.error('WARNING: failed to load redux store', err);
    return 'ERR';
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
      store.dispatch({ type: 'RECEIVE_PROJECT_DETAIL', data: projInfo });
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

const checkHomepageState = (stateName) => getReduxStore().then(
  (store) => {
    const homeState = store.getState().homepage || {};
    const nowMs = Date.now();
    if (!Object.prototype.hasOwnProperty.call(homeState, stateName)
        || (Object.prototype.hasOwnProperty.call(homeState, stateName)
          && nowMs - homeState[stateName] > 300000)
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

export const getProjectsList = () => {
  checkHomepageState('lastestListUpdating').then(
    (res) => {
      if (res === 'OLD') {
        fetchQuery(environment, gqlHelper.homepageQuery, {})
          .then(
            (data) => {
              const { projectList, summaryCounts } = transformRelayProps(data);
              updateReduxProjectList({ projectList, summaryCounts })
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
