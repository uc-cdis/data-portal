import { useRef } from 'react';
import { useResizeDetector } from 'react-resize-detector';
import {
  ReduxIndexButtonBar,
  ReduxIndexBarChart,
  ReduxIndexOverview,
  ReduxIntroduction,
} from './reduxer';
import UserPopup from '../UserPopup';
import dictIcons from '../img/icons';
import { components } from '../params';
import { breakpoints } from '../localconf';
import './page.css';

function IndexPage() {
  const { width: screenWidth } = useResizeDetector({
    handleHeight: false,
    targetRef: useRef(document.body),
  });

  return (
    <div className='index-page'>
      <div className='index-page__top'>
        <div className='index-page__introduction'>
          <ReduxIntroduction
            data={components.index.introduction}
            dictIcons={dictIcons}
          />
        </div>
        {screenWidth > breakpoints.tablet && (
          <div className='index-page__bar-chart'>
            <ReduxIndexBarChart />
          </div>
        )}
      </div>
      <ReduxIndexOverview />
      <ReduxIndexButtonBar />
      <UserPopup />
    </div>
  );
}

export default IndexPage;
