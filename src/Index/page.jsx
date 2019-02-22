import React from 'react';
import Introduction from '../components/Introduction';
import { ReduxIndexButtonBar, ReduxIndexBarChart } from './reduxer';
import dictIcons from '../img/icons';
import { components } from '../params';
import getProjectNodeCounts from './utils';
import './page.less';

class IndexPageComponent extends React.Component {
  constructor(props) {
    super(props);
    getProjectNodeCounts();
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

const IndexPage = IndexPageComponent;

export default IndexPage;
