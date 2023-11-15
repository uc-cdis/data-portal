import React from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import { Carousel, Input, Button } from 'antd';
import { ReduxIndexBarChart } from './reduxer';
import { components } from '../params';
import { loadHomepageChartDataFromDatasets, loadHomepageChartDataFromGraphQL } from './utils';
import {
  breakpoints, customHomepageChartConfig, indexPublic, homepageChartNodes,
} from '../localconf';
import IntroductionNIAID from '../components/IntroductionNIAID';
import HomepageCustomCharts from '../components/charts/HomepageCustomCharts';
import './page.less';
import './nctPage.less';

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
      // If homepageChartNodes is not enabled in the config, we will only load
      // the summary data for projects users have access to. We will still show
      // charts on the homepage, but the charts will only contain data from projects
      // the user has access to.
      loadHomepageChartDataFromGraphQL();
    }
  }

  render() {
    let homepageCharts = [];
    if (customHomepageChartConfig) {
      homepageCharts = customHomepageChartConfig.map((conf, i) => {
        switch (conf.chartType) {
        case 'horizontalGroupedBar':
          return (
            <div key={i} className='index-page__slider-chart'>
              <HomepageCustomCharts
                chartType={conf.chartType}
                dataType={conf.dataType}
                yAxisProp={conf.yAxisProp}
                xAxisProp={conf.xAxisProp}
                constrains={conf.constrains}
                chartTitle={conf.chartTitle}
                logBase={conf.logBase}
                initialUnselectedKeys={conf.initialUnselectedKeys}
                dataTypePlural={conf.dataTypePlural}
              />
            </div>
          );
        case 'image':
          return (
            <div key={i} className='index-page__slider-chart'>
              <img
                className='index-page__slider-chart-image'
                src={conf.imageLink}
                alt='homepage carousel item'
              />
            </div>
          );
        default:
          return null;
        }
      });
    }

    // if any of these charts exist
    if ((homepageChartNodes?.length)
    || (components?.charts?.indexChartNames?.length)
    || (components?.charts?.chartNames?.length)
    ) {
      homepageCharts.push(<div key={homepageCharts.length} className='index-page__slider-chart'><ReduxIndexBarChart /></div>);
    }

    return (
      <div className='index-page'>
        <div className='index-page__top'>
          <div className='index-page__introduction'>
            <IntroductionNIAID data={components.index.introduction} />
          </div>
          <div className='index-page__bar-chart'>
            <MediaQuery query={`(min-width: ${breakpoints.tablet + 1}px)`}>
              <Carousel>
                {homepageCharts}
              </Carousel>
            </MediaQuery>
            <div className='high-light nct-right-box'>
              <p><strong>Data Sharing and Submission</strong></p>
              <p>If you are interested in making your data available via this platform, please <a href={`mailto:${components.login.email}`}>contact us.</a></p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

IndexPageComponent.propTypes = {
  history: PropTypes.object.isRequired,
};

const NCTIndexPage = IndexPageComponent;

export default NCTIndexPage;
