import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MediaQuery from 'react-responsive';
import {
  ReduxIndexButtonBar,
  ReduxIndexBarChart,
  ReduxIndexOverview,
  ReduxIntroduction,
} from './reduxer';
import ReduxUserRegistration from '../UserRegistration/ReduxUserRegistration';
import { getIndexPageCounts } from './utils';
import dictIcons from '../img/icons';
import { components } from '../params';
import { breakpoints } from '../localconf';
import './page.css';

function IndexPage() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getIndexPageCounts());
  }, []);

  return (
    <div className='index-page'>
      <div className='index-page__top'>
        <div className='index-page__introduction'>
          <ReduxIntroduction
            data={components.index.introduction}
            dictIcons={dictIcons}
          />
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
