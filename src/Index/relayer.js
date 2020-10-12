import { fetchQuery } from 'relay-runtime';
import environment from '../environment';
import { GQLHelper } from '../gqlHelper';
import getReduxStore from '../reduxStore';

const gqlHelper = GQLHelper.getGQLHelper();
const dataContributorIdList = GQLHelper.getDataContributorIdList();

export const getIndexPageChartData = () =>
  checkIfNeedsUpdate().then(
    (needsUpdate) => {
      if (needsUpdate)
        fetchQuery(environment, gqlHelper.indexPageCountsQuery, {}).then(
          updateRedux
        );
    },
    (error) => updateReduxError(error)
  );

const checkIfNeedsUpdate = () =>
  getReduxStore().then(
    (store) => {
      const { updatedAt } = store.getState().index;

      // true if never updated or last updated at >5 mins
      return updatedAt === undefined || Date.now() - updatedAt > 300000;
    },
    (err) => {
      /* eslint no-console: ["error", { allow: ["error"] }] */
      console.error('WARNING: failed to load redux store', err);
      return 'ERR';
    }
  );

const updateRedux = (data) =>
  getReduxStore().then(
    (store) => {
      const indexState = store.getState().index || {};
      if (!indexState.projectsByName) {
        store.dispatch({
          type: 'RECEIVE_INDEX_PAGE_COUNTS',
          data: { ...data, names: dataContributorIdList },
        });
        return 'dispatch';
      }
      return 'NOOP';
    },
    (err) => {
      console.error('WARNING: failed to load redux store', err);
      return 'ERR';
    }
  );

const updateReduxError = (error) =>
  getReduxStore().then((store) =>
    store.dispatch({ type: 'RECEIVE_RELAY_FAIL', data: error })
  );
