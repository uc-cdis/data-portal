import React from 'react';
import PropTypes from 'prop-types';
import Introduction from '../components/Introduction';
import { ReduxIndexButtonBar, ReduxIndexBarChart } from './reduxer';
import dictIcons from '../img/icons';
import { components } from '../params';
import getProjectNodeCounts from './utils';
import './page.less';

class IndexPageComponent extends React.Component {
  constructor(props) {
    super(props);
    getProjectNodeCounts((res) => {
      // If Peregrine returns unauthorized, need to redirect to `/login` page
      if (res.needLogin) {
        props.history.push('/login');
      }
    });
  }

  render() {
    return (
      <div className='index-page'>
        <div className='index-page__top'>
          <Introduction data={components.index.introduction} dictIcons={dictIcons} />
          <ReduxIndexBarChart />
        </div>
        <ReduxIndexButtonBar />
      </div>
    );
  }
}

IndexPageComponent.propTypes = {
  history: PropTypes.object.isRequired,
};

const IndexPage = IndexPageComponent;

export default IndexPage;
