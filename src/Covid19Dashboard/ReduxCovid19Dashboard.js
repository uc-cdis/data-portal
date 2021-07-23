import { connect } from 'react-redux';
import Covid19Dashboard from '.';

import { covid19DashboardConfig } from '../localconf';
import { readMultiColumnTSV, readQuotedList } from './dataUtils.js';

async function handleDashboardData(propName, data) {
  switch (propName) {
  case 'modeledFipsList':
    return readQuotedList(data);
  case 'jhuGeojsonLatest':
  case 'jhuJsonByLevelLatest':
  case 'jhuJsonByTimeLatest':
  case 'vaccinesByCountyByDate':
    return JSON.parse(data);
  case 'top10ChartData':
  case 'idphDailyChartData':
    return readMultiColumnTSV(data);
  default:
    console.warn(`I don't know how to handle dashboard data for "${propName}"`); // eslint-disable-line no-console
  }
  return null;
}

const fetchDashboardData = (propName, filePath) => {
  const url = covid19DashboardConfig.dataUrl + filePath;
  return (dispatch) => fetch(url, dispatch)
    .then((r) => {
      switch (r.status) {
      case 200:
        return r.text();
      default:
        console.error(`Got code ${r.status} when fetching dashboard data at "${url}"`); // eslint-disable-line no-console
      }
      return '';
    })
    .catch(
      (error) => console.error(`Unable to fetch dashboard data at "${url}":`, error), // eslint-disable-line no-console
    )
    .then((data) => handleDashboardData(propName, data))
    .then((obj) => ({
      type: 'RECEIVE_DASHBOARD_DATA',
      name: propName,
      contents: obj,
    }),
    )
    .then((msg) => dispatch(msg));
};

const fetchTimeSeriesData = (dataLevel, locationId, title, withSimulation) => {
  const url = `${covid19DashboardConfig.dataUrl}time_series/${dataLevel}/${locationId}.json`;
  return (dispatch) => {
    dispatch(
      {
        type: 'OPEN_TIME_SERIES_POPUP',
        title,
      },
    );
    return fetch(url, dispatch).then((r) => {
      switch (r.status) {
      case 200:
        return r.text();
      default:
        console.error(`Got code ${r.status} when fetching time series data at "${url}"`); // eslint-disable-line no-console
      }
      return '';
    })
      .catch(
        (error) => console.error(`Unable to fetch time series data at "${url}":`, error), // eslint-disable-line no-console
      )
      .then((data) => ({
        type: 'RECEIVE_TIME_SERIES_DATA',
        title,
        modeledCountyFips: withSimulation ? locationId : null,
        contents: JSON.parse(data),
      }),
      )
      .then((msg) => dispatch(msg));
  };
};

const closeLocationPopup = () => (dispatch) => dispatch(
  { type: 'CLOSE_TIME_SERIES_POPUP' },
);

const mapStateToProps = (state) => ({
  ...state.covid19Dashboard,
});

const mapDispatchToProps = (dispatch) => ({
  fetchDashboardData: (propName, filePath) => dispatch(
    fetchDashboardData(propName, filePath),
  ),
  fetchTimeSeriesData: (dataLevel, locationId, title, withSimulation = false) => dispatch(
    fetchTimeSeriesData(dataLevel, locationId, title, withSimulation),
  ),
  closeLocationPopup: () => dispatch(
    closeLocationPopup(),
  ),
});

const ReduxCovid19Dashboard = connect(mapStateToProps, mapDispatchToProps)(Covid19Dashboard);

export default ReduxCovid19Dashboard;
