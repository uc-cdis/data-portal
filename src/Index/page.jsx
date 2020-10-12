import React from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import {
  ReduxIndexButtonBar,
  ReduxIndexBarChart,
  ReduxIndexCounts,
  ReduxIntroduction,
} from './reduxer';
import { getIndexPageChartData } from './relayer';
import dictIcons from '../img/icons';
import { components } from '../params';
import { loadHomepageChartDataFromDatasets } from './utils';
import { breakpoints, indexPublic } from '../localconf';
import './page.less';

class IndexPageComponent extends React.Component {
  componentDidMount() {
    // If the index page is publicly available, we will attempt to show the
    // homepage charts on the landing page to logged-out users as well as logged-in users.
    // To do this we will need to load data from Peregrine's datasets endpoint, which
    // can be configured to be publicly accessible to logged-out users
    // (with global.public_datasets: true in manifest.json)
    if (indexPublic) {
      loadHomepageChartDataFromDatasets((res) => {
        // If Peregrine returns unauthorized, need to redirect to `/login` page.
        if (res.needLogin) {
          this.props.history.push('/login');
        }
      });
    } else {
      getIndexPageChartData();
    }
  }

  render() {
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
