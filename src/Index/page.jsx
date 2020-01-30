import React from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import _ from 'underscore';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ReduxIndexButtonBar, ReduxIndexBarChart, ReduxIndexCounts, ReduxIntroduction } from './reduxer';
import dictIcons from '../img/icons';
import { components } from '../params';
import { loadPeregrinePublicDatasetsIntoRedux, loadProjectNodeCountsIntoRedux } from './utils';
import getReduxStore from '../reduxStore';
import { breakpoints, customHomepageChartConfig, homepageChartNodes } from '../localconf';
import HomepageCustomCharts from '../components/charts/HomepageCustomCharts';
import './page.less';

class IndexPageComponent extends React.Component {
  componentDidMount() {
    // If homepageChartNodes is enabled in the config, we will attempt to show
    // the homepage charts on the landing page to logged-out users as well as logged-in users.
    // In order to do this we load summary data for all projects from Peregrine's
    // `/datasets` endpoint, which can be configured to be publicly accessible without logging in
    // (`public_datasets: true` in the Peregrine config).
    const showHomepageChartsOnLandingPage = homepageChartNodes !== undefined;
    if (showHomepageChartsOnLandingPage) {
      getReduxStore().then((store) => {
        const fileNodes = store.getState().submission.file_nodes;
        const nodesForIndexChart = homepageChartNodes.map(item => item.node);
        const nodesToRequest = _.union(fileNodes, nodesForIndexChart);
        loadPeregrinePublicDatasetsIntoRedux(nodesToRequest, (res) => {
          // If Peregrine returns unauthorized, need to redirect to `/login` page.
          if (res.needLogin) {
            this.props.history.push('/login');
          }
        });
      });
    } else {
      // If homepageChartNodes is not enabled in the config, we will only load
      // the summary data for projects users have access to. We will still show
      // charts on the homepage, but the charts will only contain data from projects
      // the user has access to.
      loadProjectNodeCountsIntoRedux();
    }
  }

  render() {
    const sliderSettings = {
      dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true,
    };
    let customCharts = null;
    if (customHomepageChartConfig) {
      customCharts = customHomepageChartConfig.map((conf, i) => (
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
      ));
    }
    return (
      <div className='index-page'>
        <div className='index-page__top'>
          <div className='index-page__introduction'>
            <ReduxIntroduction data={components.index.introduction} dictIcons={dictIcons} />
            <MediaQuery query={`(max-width: ${breakpoints.tablet}px)`}>
              <ReduxIndexCounts />
            </MediaQuery>
          </div>
          <div className='index-page__bar-chart'>
            <MediaQuery query={`(min-width: ${breakpoints.tablet + 1}px)`}>
              <Slider {...sliderSettings}>
                <div className='index-page__slider-chart'><ReduxIndexBarChart /></div>
                {customCharts}
              </Slider>
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
