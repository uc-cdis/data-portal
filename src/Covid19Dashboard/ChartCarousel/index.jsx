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
        console.error(`ChartCarousel is missing '${chartConfig.prop}' prop found in configuration`); // eslint-disable-line no-console
        return;
      }

      // generate the chart
      let chart = null;
      const plotChartConfig = { ...chartConfig, plots: this.props[chartConfig.prop] };
      switch (chartConfig.type) {
      case 'component':
        chart = this.props[chartConfig.prop];
        break;
      case 'image':
        chart = (<img
          className='chart-carousel__image'
          src={dataUrl + this.props[chartConfig.prop]}
          alt={`Chart${chartConfig.title ? ` for ${chartConfig.title}` : ''}`}
        />);
        break;
      case 'lineChart':
        chart = Object.keys(plotChartConfig.plots).length > 0 ?
          <PlotChart {...plotChartConfig} />
          : null;
        break;
      default:
        console.error(`ChartCarousel cannot handle '${chartConfig.type}' chart type found in configuration`); // eslint-disable-line no-console
      }

      // if the chart data is not loaded yet, do not display an empty chart
      if (!chart) {
        return;
      }

      // TODO: description scrollbar
      const showDescriptionColumn = this.props.isInPopup && (
        chartConfig.title || chartConfig.description
      );
      const chartContainer = (<div
        key={0}
        onMouseOver={() => this.onChartHover(i)}
        onMouseOut={() => this.onChartHover(null)}
      >
        <div className={showDescriptionColumn ? 'chart-carousel__left-column' : ''}>
          {chart}
        </div>
        { showDescriptionColumn &&
          <div className='chart-carousel__description'>
            <h3>
              {chartConfig.title}
            </h3>
            <p>
              {chartConfig.description}
            </p>
          </div>
        }
      </div>);
      charts.push(chartContainer);
    });

    const showDescriptionHover = !this.props.isInPopup &&
      this.state.hoveredChartId !== null &&
      (
        this.props.chartsConfig[this.state.hoveredChartId].title
        || this.props.chartsConfig[this.state.hoveredChartId].description
      );

    return (
      charts.length > 0 ?
        <div>
          <div
            className={`chart-carousel__container ${this.props.isInPopup ? '' : 'chart-carousel__container-border'}`}
            ref={this.containerRef}
            // match the popup width...
            style={this.props.isInPopup ? { width: '70vw' } : {}}
          >
            <Slider {...sliderSettings}>
              {charts}
            </Slider>
          </div>

          { showDescriptionHover &&
            <div className='chart-carousel__hover' style={{ top: this.state.hoverYPosition }} >
              <h3>
                {this.props.chartsConfig[this.state.hoveredChartId].title}
              </h3>
              <p>
                {this.props.chartsConfig[this.state.hoveredChartId].description}
              </p>
            </div>
          }
        </div>
        : <Spinner />
    );
  }
}

ChartCarousel.propTypes = {
  chartsConfig: PropTypes.array.isRequired,
  isInPopup: PropTypes.bool,
};

ChartCarousel.defaultProps = {
  isInPopup: false,
};

export default ChartCarousel;
