import React from 'react';
import PropTypes from 'prop-types';

import { ReduxIndexButtonBar } from './reduxer';
import ReduxCovid19Dashboard from '../Covid19Dashboard/ReduxCovid19Dashboard';
import './page.less';

class IndexPageComponent extends React.Component {
  render() {
    return (
      <div className='index-page'>
        <ReduxCovid19Dashboard
          {...this.props}
        />
        <ReduxIndexButtonBar {...this.props} />
      </div>
    );
  }
}

IndexPageComponent.propTypes = {
  history: PropTypes.object.isRequired,
};

const Covid19IndexPage = IndexPageComponent;

export default Covid19IndexPage;
