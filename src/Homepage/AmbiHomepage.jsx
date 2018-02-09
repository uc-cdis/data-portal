import React from 'react';
import { RelayProjectDashboard } from './Relay/RelayHomepage';
import ReduxProjectDashboard from './Redux/ReduxProjectDashboard';
import RelayTransactionLogComponent from './Relay/RelayTransactionLog';
import getReduxStore from '../reduxStore';


let dataInReduxDate = null;

//
// Set a flag once data is in Redux
//
getReduxStore().then(
  (store) => {
    const unsub = store.subscribe(
      () => {
        if (store.homepage && store.homepage.projectList && store.homepage.summaryCounts) {
          dataInReduxDate = new Date();
          unsub();
        }
      },
    );
  },
);

/**
 * Ambidextrous dashboard that toggles between
 * RelayProjectDashboard and ReduxProjectDashboard.
 */
class AmbidextrousDashboard extends React.Component {
  render() {
    const nowMs = Date.now();
    // use redux if it has the data, and data is fresh
    if (dataInReduxDate && (nowMs - dataInReduxDate.getTime() < 300000)) {
      return (
        <div>
          <ReduxProjectDashboard />
          <RelayTransactionLogComponent />
        </div>
      );
    }
    dataInReduxDate = new Date();
    return (
      <div>
        <RelayProjectDashboard />
        <RelayTransactionLogComponent />
      </div>
    );
  }
}


/**
 * Ambidextrous homepage
 */
const AmbiHomepage = AmbidextrousDashboard;


export default AmbiHomepage;

