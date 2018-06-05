import React from 'react';
import { ReduxProjectDashboard, ReduxTransaction } from './reduxer';
import getProjectsList from '../Index/relayer';
import getTransactionList from './relayer';

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    getProjectsList();
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
