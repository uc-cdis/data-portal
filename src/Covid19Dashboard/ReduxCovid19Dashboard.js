import { connect } from 'react-redux';
import Covid19Dashboard from '../Covid19Dashboard';

import { covid19DashboardConfig } from '../localconf';
import { readSingleColumnTSV, readMultiColumnTSV } from './dataUtils.js';

let dataUrl = covid19DashboardConfig.dataUrl;
dataUrl = !dataUrl.endsWith('/') ? `${dataUrl}/` : dataUrl;

async function handleDashboardData(propName, data) {
  switch (propName) {
  case 'jhuGeojsonLatest':
  case 'jhuJsonByLevelLatest':
    return JSON.parse(data);
  case 'seirObserved':
  case 'seirSimulated':
    return readSingleColumnTSV(data);
  case 'top10':
    return readMultiColumnTSV(data);
  case 'idphDaily':
    return readMultiColumnTSV(data); // change the name
  default:
    console.warn(`I don't know how to handle dashboard data for "${propName}"`); // eslint-disable-line no-console
    // return 'ERROR_FETCH_DASHBOARD_DATA';
  }
  return null;
}

const fetchDashboardData = (propName, filePath) => (
  // TODO refactor this probably. to handle errors better
  dispatch => fetch(dataUrl + filePath, dispatch)
    .then((r) => {
      switch (r.status) {
      case 200:
        return r.text();
      default:
        console.error(`Got code ${r.status} when fetching dashboard data at "${dataUrl + filePath}"`); // eslint-disable-line no-console
      }
      return '';
    })
    .catch(
      error => console.error(`Unable to fetch dashboard data at "${dataUrl + filePath}":`, error), // eslint-disable-line no-console
    )
    .then(data => handleDashboardData(propName, data))
    .then(obj =>
      // switch (obj) {
      // case 'ERROR_FETCH_DASHBOARD_DATA':
      //   return {
      //     type: 'ERROR_FETCH_DASHBOARD_DATA',
      //   };
      // default:
      ({
        type: 'RECEIVE_DASHBOARD_DATA',
        name: propName,
        contents: obj,
      }),
      // }
    )
    .then(msg => dispatch(msg))
);

const mapStateToProps = state => ({
  ...state.covid19Dashboard,
});

const mapDispatchToProps = dispatch => ({
  fetchDashboardData: (propName, filePath) => dispatch(fetchDashboardData(propName, filePath)),
});

const ReduxCovid19Dashboard = connect(mapStateToProps, mapDispatchToProps)(Covid19Dashboard);

export default ReduxCovid19Dashboard;
