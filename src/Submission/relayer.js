import { fetchQuery, graphql } from 'relay-runtime';
import environment from '../environment';
import GQLHelper from '../gqlHelper';
import { config } from '../params';

export const getTransactionList =
  () => (/** @type {import('redux').Dispatch} */ dispatch) => {
    const query = graphql`
      query relayerTransactionLogComponentQuery {
        transactionList: transaction_log(last: 20) {
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
      }
    `;
    fetchQuery(environment, query, {}).subscribe({
      next: (data) => {
        dispatch({
          type: 'RECEIVE_TRANSACTION_LIST',
          data: data.transactionList,
        });
      },
      error: (error) => {
        dispatch({ type: 'RECEIVE_RELAY_FAIL', data: error });
      },
    });
  };

const gqlHelper = GQLHelper.getGQLHelper();

/**
 * Translate relay properties to {summaryCounts, projectList} structure
 * that is friendly to underlying components.
 */
const transformRelayProps = (data) => {
  const { fileCount } = GQLHelper.extractFileInfo(data);
  const nodeCount = Math.min(config.graphql.boardCounts.length + 1, 4);
  const projectList = /** @type {Array} */ (data.projectList || []).map(
    (proj) =>
      // fill in missing properties
      ({
        name: 'unknown',
        counts: new Array(nodeCount).fill(0),
        charts: [0, 0],
        ...proj,
      })
  );
  const summaryCounts = Object.keys(data)
    .filter((key) => key.indexOf('count') === 0)
    .map((key) => key)
    .sort()
    .map((key) => data[key]);

  return {
    projectList,
    summaryCounts:
      summaryCounts.length < 4 ? [...summaryCounts, fileCount] : summaryCounts,
  };
};

const extractCounts = (data) => {
  const { fileCount } = GQLHelper.extractFileInfo(data);
  let counts = Object.keys(data)
    .filter((key) => key.indexOf('count') === 0)
    .map((key) => key)
    .sort()
    .map((key) => data[key]);
  if (counts.length < 4) {
    counts = [...counts, fileCount];
  }
  return counts;
};

const extractCharts = (data) =>
  Object.keys(data)
    .filter((key) => key.indexOf('chart') === 0)
    .map((key) => key)
    .sort()
    .map((key) => data[key]);

const getProjectDetail =
  (projectList) => (/** @type {import('redux').Dispatch} */ dispatch) => {
    projectList.forEach((project) => {
      fetchQuery(environment, gqlHelper.projectDetailQuery, {
        name: project.name,
      }).subscribe({
        next: (data) => {
          dispatch({
            type: 'RECEIVE_PROJECT_DETAIL',
            data: {
              ...data.project[0],
              counts: extractCounts(data),
              charts: extractCharts(data),
            },
          });
        },
      });
    });
  };

export const getProjectsList =
  () =>
  /**
   * @param {import('redux-thunk').ThunkDispatch} dispatch
   * @param {() => { submission: import('./types').SubmissionState }} getState
   */
  (dispatch, getState) => {
    const { lastestListUpdating } = getState().submission;
    if (!lastestListUpdating || Date.now() - lastestListUpdating > 300000)
      fetchQuery(environment, gqlHelper.submissionPageQuery, {}).subscribe({
        next: (data) => {
          const { projectList, summaryCounts } = transformRelayProps(data);
          dispatch({
            type: 'RECEIVE_PROJECT_LIST',
            data: { projectList, summaryCounts },
          });
          dispatch(getProjectDetail(projectList));
        },
        error: (error) => {
          dispatch({ type: 'RECEIVE_RELAY_FAIL', data: error });
        },
      });
  };
