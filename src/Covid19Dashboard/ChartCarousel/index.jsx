import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
// import Slider from 'react-slick';
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';

import { covid19DashboardConfig } from '../../localconf';
import PlotChart from '../PlotChart';
import './ChartCarousel.less';

let dataUrl = covid19DashboardConfig.dataUrl;
dataUrl = !dataUrl.endsWith('/') ? `${dataUrl}/` : dataUrl;


class ChartCarousel extends PureComponent {
  constructor(props) {
    super(props);
    this.carouselRefs = {};
    this.state = {
      hoverEnabled: false,
      hoverYPosition: 0,
      hoverTitleContents: '',
      hoverDescriptionContents: '',
    };
  }

  onChartHover(carouselId) {
    if (carouselId === null) { // disable hover
      this.setState({
        hoverEnabled: false,
      });
      return;
    }

    // match top of carousel component + 10 pixels
    const boundsRect = this.carouselRefs[carouselId].current.getBoundingClientRect();
    const topY = boundsRect.top + window.scrollY + 10;

    const chartConfig = this.props.chartsConfig[0]; // TODO use chart ID
    this.setState({
      // TODO can maybe replace with 'hoverOn/Off' when can use 'item'
      // to get title and description
      hoverEnabled: true,
      hoverYPosition: topY,
      hoverTitleContents: chartConfig.title,
      hoverDescriptionContents: chartConfig.description,
    });
  }

  getCarouselRef = (itemUniqueId) => {
    if (!this.carouselRefs[itemUniqueId]) {
      this.carouselRefs[itemUniqueId] = React.createRef();
    }
    return this.carouselRefs[itemUniqueId];
  }

  render() {
    // const sliderSettings = {
    //   dots: true,
    //   infinite: false,
    //   speed: 500,
    //   slidesToShow: 1,
    //   slidesToScroll: 1,
    //   arrows: true,
    // };
    // let customCharts = null;
    // if (customHomepageChartConfig) {
    //   customCharts = customHomepageChartConfig.map((conf, i) => (
    //     <div key={i} className='index-page__slider-chart'>
    //       <HomepageCustomCharts
    //         chartType={conf.chartType}
    //         dataType={conf.dataType}
    //         yAxisProp={conf.yAxisProp}
    //         xAxisProp={conf.xAxisProp}
    //         constrains={conf.constrains}
    //         chartTitle={conf.chartTitle}
    //         logBase={conf.logBase}
    //         initialUnselectedKeys={conf.initialUnselectedKeys}
    //         dataTypePlural={conf.dataTypePlural}
    //       />
    //     </div>
    //   ));
    // }

    // console.log('state', this.state);
    if (!this.props.chartsConfig.length) {
      return null;
    }

    let chartConfig = this.props.chartsConfig[0]; // TODO use chart ID

    if (!(chartConfig.prop in this.props)) {
      console.error(`ChartCarousel is missing '${chartConfig.prop}' prop configured in chartsConfig`); // eslint-disable-line no-console
      return null;
    }

    let chart = null;
    if (chartConfig.type === 'image') {
      chart = (<img
        className='chart-carousel__image'
        src={dataUrl + this.props[chartConfig.prop]}
        alt={`Chart${chartConfig.title ? ` for ${chartConfig.title}` : ''}`}
      />);
    } else {
      chartConfig = { ...chartConfig, plots: this.props[chartConfig.prop] };
      chart = Object.keys(chartConfig.plots).length > 0 ?
        <PlotChart {...chartConfig} />
        : null;
    }

    return (
      // TODO carousel here
      <div>
        {/* <Slider {...sliderSettings}>
          <div className='index-page__slider-chart'><ReduxIndexBarChart /></div>
          {customCharts}
        </Slider> */}
        <div
          ref={this.getCarouselRef(0)} // TODO ID of carousel, not of chart
          onMouseOver={() => this.onChartHover(0)}
          onMouseOut={() => this.onChartHover(null)}
        >
          {chart}
        </div>
        { this.state.hoverEnabled &&
          <div className='chart-carousel__hover' style={{ top: this.state.hoverYPosition }} >
            <h3>{this.state.hoverTitleContents}</h3>
            <p>{this.state.hoverDescriptionContents}</p>
          </div>
        }
      </div>
    );
  }
}

ChartCarousel.propTypes = {
  chartsConfig: PropTypes.array.isRequired,
};

export default ChartCarousel;
