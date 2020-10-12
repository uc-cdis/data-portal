/* eslint no-console: ["error", { allow: ["error"] }] */

import { fetchQuery } from 'relay-runtime';
import environment from '../environment';
import { GQLHelper } from '../gqlHelper';
import getReduxStore from '../reduxStore';

const { indexPageCountsQuery } = GQLHelper.getGQLHelper();
const dataContributorIdList = GQLHelper.getDataContributorIdList();

export const getIndexPageChartData = () =>
  checkIfNeedsUpdate().then(
    (needsUpdate) => {
      if (needsUpdate)
        fetchQuery(environment, indexPageCountsQuery, {}).then((data) =>
          updateRedux({ ...data, names: dataContributorIdList })
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
    (err) => console.error('WARNING: failed to load redux store', err)
  );

const updateRedux = (data) =>
  getReduxStore().then(
    (store) => {
      const { projectsByName } = store.getState().index;

      if (projectsByName === undefined)
        store.dispatch({ type: 'RECEIVE_INDEX_PAGE_COUNTS', data });
    },
    (err) => console.error('WARNING: failed to load redux store', err)
  );

const updateReduxError = (error) =>
  getReduxStore().then((store) =>
    store.dispatch({ type: 'RECEIVE_RELAY_FAIL', data: error })
  );
