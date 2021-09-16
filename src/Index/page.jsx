import React, { useEffect } from 'react';
import MediaQuery from 'react-responsive';
import {
  ReduxIndexButtonBar,
  ReduxIndexBarChart,
  // ReduxIndexCounts,
  ReduxIndexOverview,
  ReduxIntroduction,
} from './reduxer';
import ReduxUserRegistration from '../UserRegistration/ReduxUserRegistration';
import { getIndexPageCounts } from './utils';
import dictIcons from '../img/icons';
import { components } from '../params';
import { breakpoints } from '../localconf';
import './page.less';

function IndexPage() {
  useEffect(() => {
    getIndexPageCounts();
  }, []);

  return (
    <div className='index-page'>
      <div className='index-page__top'>
        <div className='index-page__introduction'>
          <ReduxIntroduction
            data={components.index.introduction}
            dictIcons={dictIcons}
          />
          {/* <MediaQuery query={`(max-width: ${breakpoints.tablet}px)`}>
            <ReduxIndexCounts />
          </MediaQuery> */}
        </div>
        <div className='index-page__bar-chart'>
          <MediaQuery query={`(min-width: ${breakpoints.tablet + 1}px)`}>
            <ReduxIndexBarChart />
          </MediaQuery>
        </div>
      </div>
      <ReduxIndexOverview />
      <ReduxIndexButtonBar />
      <ReduxUserRegistration />
    </div>
  );
}

export default IndexPage;
