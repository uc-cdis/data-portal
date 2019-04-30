import React from 'react';
import PropTypes from 'prop-types';
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
      <div style={{ padding: '40px 20px' }}>
        <ReduxProjectDashboard {...this.props} />
        <ReduxTransaction />
      </div>
    );
  }
}

HomePage.propTypes = {
  history: PropTypes.object.isRequired,
};

export default HomePage;
