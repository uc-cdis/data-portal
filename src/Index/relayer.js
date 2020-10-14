/* eslint no-console: ["error", { allow: ["error"] }] */

import { fetchQuery } from 'relay-runtime';
import environment from '../environment';
import { GQLHelper } from '../gqlHelper';
import getReduxStore from '../reduxStore';

const { indexPageQuery, indexPageOverviewQuery } = GQLHelper.getGQLHelper();
const consortiumList = GQLHelper.getConsortiumList();

export const getIndexPageChartData = () =>
  checkIfNeedsUpdate().then(
    (needsUpdate) => {
      if (needsUpdate)
        fetchQuery(environment, indexPageQuery, {}).then((data) =>
          updateRedux({ ...data, names: consortiumList })
        );
    },
    (error) => updateReduxError(error)
  );

export const getIndexPageOverviewData = () =>
  getReduxStore().then(
    (store) => {
      const { overviewCounts } = store.getState().index;
      const needsUpdate =
        overviewCounts === undefined ||
        Date.now() - overviewCounts.updatedAt > 300000;
      if (needsUpdate)
        fetchQuery(environment, indexPageOverviewQuery, {}).then(
          (data) =>
            store.dispatch({
              type: 'RECEIVE_INDEX_PAGE_OVERVIEW_COUNTS',
              data: { ...data, names: consortiumList },
            }),
          (error) => updateReduxError(error)
        );
    },
    (err) => console.error('WARNING: failed to load redux store', err)
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
