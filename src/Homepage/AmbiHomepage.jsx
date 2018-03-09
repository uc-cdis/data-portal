import React from 'react';
import { RelayProjectDashboard } from './Relay/RelayHomepage';
import ReduxProjectDashboard from './Redux/ReduxProjectDashboard';
import RelayTransactionLog from './Relay/RelayTransactionLog';
import getReduxStore from '../reduxStore';


let dataInReduxDate = null;

//
// Set a flag once data is in Redux
//
getReduxStore().then(
  (store) => {
    const unsub = store.subscribe(
      () => {
        const state = store.getState();
        // console.log("Got some data?", state);
        if (state.homepage && state.homepage.projectsByName && state.homepage.summaryCounts) {
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
      // console.log("Rendering REDUX?", dataInReduxDate);
      return (
        <div>
          <ReduxProjectDashboard />
          <RelayTransactionLog />
        </div>
      );
    }

    // console.log("Rendering in RELAY");
    if (dataInReduxDate) {
      dataInReduxDate = new Date(); // refresh date after initial load has completed
    }
    return (
      <div>
        <RelayProjectDashboard />
        <RelayTransactionLog />
      </div>
    );
  }
}


/**
 * Ambidextrous homepage
 */
const AmbiHomepage = AmbidextrousDashboard;


export default AmbiHomepage;

