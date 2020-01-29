import React from 'react';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ReduxIndexButtonBar, ReduxIndexBarChart, ReduxIndexCounts, ReduxIntroduction } from './reduxer';
import dictIcons from '../img/icons';
import { components } from '../params';
import getProjectNodeCounts from './utils';
import { breakpoints, customHomepageChartConfig } from '../localconf';
import HomepageCustomCharts from '../components/charts/HomepageCustomCharts';
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
