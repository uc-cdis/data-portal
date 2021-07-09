import React from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import { Carousel } from 'antd';
import {
  ReduxIndexButtonBar, ReduxIndexBarChart, ReduxIndexCounts, ReduxIntroduction,
} from './reduxer';
import dictIcons from '../img/icons';
import { components } from '../params';
import { loadHomepageChartDataFromDatasets, loadHomepageChartDataFromGraphQL } from './utils';
import {
  breakpoints, customHomepageChartConfig, indexPublic, homepageChartNodes,
} from '../localconf';
import HomepageCustomCharts from '../components/charts/HomepageCustomCharts';
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

    // indexChartNames and chartNames has to > 1 in here since by default we push in 'Files' as chart if there is less than 4 chart fields
    // FIXME: remove this fix once we get rid of the pushing 'Files' into charts by default logic
    if ((homepageChartNodes && homepageChartNodes.length > 0)
    || (components.charts && components.charts.indexChartNames && components.charts.indexChartNames.length > 1)
    || (components.charts && components.charts.chartNames && components.charts.chartNames.length > 1)
    ) {
      homepageCharts.push(<div key={homepageCharts.length} className='index-page__slider-chart'><ReduxIndexBarChart /></div>);
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
              <Carousel>
                {homepageCharts}
              </Carousel>
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
