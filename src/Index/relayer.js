import { fetchQuery } from 'relay-runtime';
import environment from '../environment';
import { GQLHelper } from '../gqlHelper';
import getReduxStore from '../reduxStore';

const gqlHelper = GQLHelper.getGQLHelper();
const dataContributorIdList = GQLHelper.getDataContributorIdList();

export const getIndexPageChartData = () => {
  checkIndexState('lastestListUpdating').then(
    (res) => {
      if (res === 'OLD')
        fetchQuery(environment, gqlHelper.indexPageCountsQuery, {}).then(
          updateRedux
        );
    },
    (error) => updateReduxError(error)
  );
};

const checkIndexState = (stateName) =>
  getReduxStore().then(
    (store) => {
      const indexState = store.getState().index || {};
      const nowMs = Date.now();
      if (
        !Object.prototype.hasOwnProperty.call(indexState, stateName) ||
        (Object.prototype.hasOwnProperty.call(indexState, stateName) &&
          nowMs - indexState[stateName] > 300000)
      ) {
        return 'OLD';
      }
      return 'FRESH';
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
