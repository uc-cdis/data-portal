import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { covid19DashboardConfig } from '../../localconf';
import PlotChart from '../PlotChart';
import './ChartCarousel.less';

let dataUrl = covid19DashboardConfig.dataUrl;
dataUrl = !dataUrl.endsWith('/') ? `${dataUrl}/` : dataUrl;


class ChartCarousel extends PureComponent {
  state = {
    hoverEnabled: false,
    hoverTitleContents: '',
    hoverDescriptionContents: '',
  };


  onChartHover() {
    const chartConfig = this.props.chartsConfig[0];
    // console.log(chartConfig.description);
    this.setState({
      // TODO can maybe replace with 'hoverOn/Off' when can use 'item'
      // to get title and description
      hoverEnabled: true,
      hoverTitleContents: chartConfig.title,
      hoverDescriptionContents: chartConfig.description,
    });
  }

  onChartHoverOff() {
    // console.log('  leaving chart');
    this.setState({
      hoverEnabled: false,
    });
  }

  render() {
    // console.log('state', this.state);
    if (!this.props.chartsConfig.length) {
      return null;
    }

    let chartConfig = this.props.chartsConfig[0];

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
        <div
          onMouseOver={() => this.onChartHover()}
          onMouseOut={() => this.onChartHoverOff()}
        >
          {chart}
        </div>
        { this.state.hoverEnabled &&
          <div className='chart-carousel__hover' >
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
