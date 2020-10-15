import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import {
  ReduxIndexButtonBar,
  ReduxIndexBarChart,
  ReduxIndexCounts,
  ReduxIndexOverview,
  ReduxIntroduction,
} from './reduxer';
import { getIndexPageChartData, getIndexPageOverviewData } from './relayer';
import dictIcons from '../img/icons';
import { components } from '../params';
import { breakpoints } from '../localconf';
import './page.less';

function IndexPage({ history }) {
  useEffect(() => {
    getIndexPageChartData();
    getIndexPageOverviewData();
  }, []);

  return (
    <div className='index-page'>
      <div className='index-page__top'>
        <div className='index-page__introduction'>
          <ReduxIntroduction
            data={components.index.introduction}
            dictIcons={dictIcons}
          />
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
      <ReduxIndexOverview />
      <ReduxIndexButtonBar history={history} />
    </div>
  );
}

IndexPage.propTypes = {
  history: PropTypes.object.isRequired,
};

export default IndexPage;
