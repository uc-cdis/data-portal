import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { covid19DashboardConfig } from '../../localconf';
import Spinner from '../../components/Spinner';
import PlotChart from '../PlotChart';
import './ChartCarousel.less';

let dataUrl = covid19DashboardConfig.dataUrl;
dataUrl = !dataUrl.endsWith('/') ? `${dataUrl}/` : dataUrl;


class ChartCarousel extends PureComponent {
  constructor(props) {
    super(props);
    this.containerRef = React.createRef();
    this.state = {
      hoveredChartId: null,
      hoverYPosition: 0,
    };
  }

  onChartHover(hoveredChartId) {
    // match top of carousel component + 10 pixels
    const boundsRect = this.containerRef.current.getBoundingClientRect();
    const topY = boundsRect.top + window.scrollY + 10;
    this.setState({
      hoveredChartId, // if null, will not display hover info
      hoverYPosition: topY,
    });
  }

  render() {
    if (!this.props.chartsConfig.length) {
      return null;
    }

    const sliderSettings = {
      dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true,
    };

    const charts = [];
    this.props.chartsConfig.forEach((chartConfig, i) => {
      // make sure the chart data is available as prop
      if (!(chartConfig.prop in this.props)) {
        console.error(`ChartCarousel is missing '${chartConfig.prop}' prop configured in chartsConfig`); // eslint-disable-line no-console
        return;
      }

      // generate the chart
      let chart = null;
      if (chartConfig.type === 'image') {
        chart = (<img
          className='chart-carousel__image'
          src={dataUrl + this.props[chartConfig.prop]}
          alt={`Chart${chartConfig.title ? ` for ${chartConfig.title}` : ''}`}
        />);
      } else {
        const config = { ...chartConfig, plots: this.props[chartConfig.prop] };
        chart = Object.keys(config.plots).length > 0 ?
          <PlotChart {...config} />
          : null;
      }

      // if the chart data is not loaded yet, do not display an empty chart
      if (!chart) {
        return;
      }

      const chartContainer = (<div
        key={0}
        onMouseOver={() => this.onChartHover(i)}
        onMouseOut={() => this.onChartHover(null)}
      >
        {chart}
      </div>);
      charts.push(chartContainer);
    });

    return (
      charts.length > 0 ?
        <div>
          <div
            className='chart-carousel__container'
            ref={this.containerRef}
          >
            <Slider {...sliderSettings}>
              {charts}
            </Slider>
          </div>

          { this.state.hoveredChartId !== null &&
          <div className='chart-carousel__hover' style={{ top: this.state.hoverYPosition }} >
            <h3>{this.props.chartsConfig[this.state.hoveredChartId].title}</h3>
            <p>{this.props.chartsConfig[this.state.hoveredChartId].description}</p>
          </div>
          }
        </div>
        : <Spinner />
    );
  }
}

ChartCarousel.propTypes = {
  chartsConfig: PropTypes.array.isRequired,
};

export default ChartCarousel;
