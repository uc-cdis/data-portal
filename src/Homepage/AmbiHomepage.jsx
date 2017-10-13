import React from 'react';
import { RelayProjectDashboard } from './RelayHomepage';
import ReduxProjectDashboard from './ReduxProjectDashboard';
import { withAuthTimeout, withBoxAndNav } from '../utils';
import { getReduxStore } from '../reduxStore';


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
      return <ReduxProjectDashboard />;
    }
    dataInReduxDate = new Date();
    return <RelayProjectDashboard />;
  }
}


/**
 * Ambidextrous homepage
 */
const AmbiHomepage = withBoxAndNav(withAuthTimeout(AmbidextrousDashboard));


export default AmbiHomepage;

