import React from 'react';
import { ReduxProjectDashboard, ReduxTransaction } from './reduxer';
import getProjectNodeCounts from '../Index/utils';
import getTransactionList from './relayer';

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    getProjectNodeCounts();
    getTransactionList();
  }

  render() {
    return (
      <div style={{ paddingTop: '40px' }}>
        <ReduxProjectDashboard />
        <ReduxTransaction />
      </div>
    );
  }
}

export default HomePage;
