import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Carousel } from 'antd';

import { covid19DashboardConfig } from '../../localconf';
import Spinner from '../../components/Spinner';
import PlotChart from '../PlotChart';
import './ChartCarousel.less';

import Popup from '../../components/Popup';

class ChartCarousel extends PureComponent {
  constructor(props) {
    super(props);
    this.containerRef = React.createRef();
    this.state = {
      hoveredChartId: null,
      hoverYPosition: 0,
      popupChart: null,
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

  onChartClick = (chartConfig) => {
    if (!this.props.enablePopupOnClick) {
      return;
    }

    this.setState({
      popupChart: {
        title: chartConfig.title,
        config: chartConfig,
      },
    });
  }

  closePopupChart = () => {
    this.setState({
      popupChart: null,
    });
  }

  render() {
    if (!this.props.chartsConfig.length) {
      return null;
    }

    const charts = [];
    this.props.chartsConfig.forEach((chartConfig, i) => {
      const hasImagePath = chartConfig.type === 'image' && chartConfig.path;

      // make sure the chart data is available as prop
      if (!(chartConfig.prop in this.props) && !hasImagePath && !chartConfig.guppyConfig) {
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
        chart = (
          <img
            className='chart-carousel__image'
            src={covid19DashboardConfig.dataUrl
            + (hasImagePath ? chartConfig.path : this.props[chartConfig.prop])}
            alt={`Chart${chartConfig.title ? ` for ${chartConfig.title}` : ''}`}
          />
        );
        break;
      case 'lineChart':
      case 'barChart':
        chart = <PlotChart {...plotChartConfig} />;
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

      const chartContainerDivProps = {
        key: 0,
        onMouseOver: () => this.onChartHover(i),
        onMouseOut: () => this.onChartHover(null),
      };
      // If chart is clickable
      if (this.props.enablePopupOnClick) {
        chartContainerDivProps.onClick = () => this.onChartClick(chartConfig);
        chartContainerDivProps.role = 'button';
        chartContainerDivProps.tabIndex = 0;
      }
      const chartContainer = (
        <div {...chartContainerDivProps}>
          <div
            className={`${this.props.isInPopup ? 'chart-carousel__popup-chart' : null} ${showDescriptionColumn ? 'chart-carousel__left-column' : ''}`}
          >
            {chart}
          </div>
          { showDescriptionColumn
          && (
            <div className='chart-carousel__description'>
              <h3>
                {chartConfig.title}
              </h3>
              <p>
                {chartConfig.description}
              </p>
            </div>
          )}
        </div>
      );
      charts.push(chartContainer);
    });

    const showDescriptionHover = !this.props.isInPopup
      && this.state.hoveredChartId !== null
      // do not show the hover if there is a title without
      // description - the title is already displayed
      && this.props.chartsConfig[this.state.hoveredChartId].description;

    return (
      charts.length > 0
        ? (
          <div>
            <div
              className={`chart-carousel__container ${this.props.isInPopup ? '' : 'chart-carousel__container-border'}`}
              ref={this.containerRef}
              // match the popup width...
              style={this.props.isInPopup ? { width: '70vw' } : {}}
            >
              <Carousel arrows dots infinite={false}>
                {charts}
              </Carousel>
            </div>

            { showDescriptionHover
            && (
              <div className='chart-carousel__hover' style={{ top: this.state.hoverYPosition }}>
                <h3>
                  {this.props.chartsConfig[this.state.hoveredChartId].title}
                </h3>
                <p>
                  {this.props.chartsConfig[this.state.hoveredChartId].description}
                </p>
              </div>
            )}
            {/* popup when click on a chart */}
            {
              this.state.popupChart
                ? (
                  <Popup
                    title={this.state.popupChart.title}
                    onClose={() => this.closePopupChart()}
                  >
                    <ChartCarousel
                      {...this.props}
                      chartsConfig={[this.state.popupChart.config]}
                      isInPopup
                      enablePopupOnClick={false}
                    />
                  </Popup>
                )
                : null
            }
          </div>
        )
        : <Spinner />
    );
  }
}

ChartCarousel.propTypes = {
  chartsConfig: PropTypes.array.isRequired,
  isInPopup: PropTypes.bool,
  enablePopupOnClick: PropTypes.bool,
};

ChartCarousel.defaultProps = {
  isInPopup: false,
  enablePopupOnClick: false,
};

export default ChartCarousel;
