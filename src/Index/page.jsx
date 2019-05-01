import React from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import Introduction from '../components/Introduction';
import { ReduxIndexButtonBar, ReduxIndexBarChart, ReduxIndexCounts } from './reduxer';
import dictIcons from '../img/icons';
import { components } from '../params';
import getProjectNodeCounts from './utils';
import { breakpoints } from '../localconf';
import './page.less';

class IndexPageComponent extends React.Component {
  componentDidMount() {
    getProjectNodeCounts((res) => {
      // If Peregrine returns unauthorized, need to redirect to `/login` page
      if (res.needLogin) {
        this.props.history.push('/login');
      }
    });
  }

  render() {
    return (
      <div className='index-page'>
        <div className='index-page__top'>
          <div className='index-page__introduction'>
            <Introduction data={components.index.introduction} dictIcons={dictIcons} />
            <MediaQuery query={`(max-width: ${breakpoints.tablet}px)`}>
              <ReduxIndexCounts />
            </MediaQuery>
          </div>
          <div className='index-page__bar-chart'>
            <MediaQuery query={`(min-width: ${breakpoints.tablet + 1}px)`}>
              <ReduxIndexBarChart />
            </MediaQuery>
          </div>
        </div>
        <ReduxIndexButtonBar {...this.props} />
      </div>
    );
  }
}

IndexPageComponent.propTypes = {
  history: PropTypes.object.isRequired,
};

const IndexPage = IndexPageComponent;

export default IndexPage;
