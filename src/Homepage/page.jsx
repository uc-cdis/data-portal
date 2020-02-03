import React from 'react';
import PropTypes from 'prop-types';
import { ReduxProjectDashboard, ReduxTransaction } from './reduxer';
import { getTransactionList, getProjectsList } from './relayer';

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    getProjectsList();
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
