import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { covid19DashboardConfig } from '../../localconf';
import PlotChart from '../PlotChart';
import './ChartCarousel.less';

let dataUrl = covid19DashboardConfig.dataUrl;
dataUrl = !dataUrl.endsWith('/') ? `${dataUrl}/` : dataUrl;


class ChartCarousel extends PureComponent {
  render() {
    if (!this.props.chartsConfig.length) {
      return null;
    }

    let chartConfig = this.props.chartsConfig[0];

    if (!(chartConfig.prop in this.props)) {
      console.error(`ChartCarousel is missing '${chartConfig.prop}' prop configured in chartsConfig`); // eslint-disable-line no-console
      return null;
    }

    if (chartConfig.type === 'image') {
      return (<img
        className='chart-carousel__image'
        src={dataUrl + this.props[chartConfig.prop]}
        alt={`Chart${chartConfig.title ? ` for ${chartConfig.title}` : ''}`}
      />);
    }

    chartConfig = { ...chartConfig, plots: this.props[chartConfig.prop] };
    const chart = Object.keys(chartConfig.plots).length > 0 ? <PlotChart {...chartConfig} /> : null;

    return (
      // TODO carousel here
      chart
    );
  }
}

ChartCarousel.propTypes = {
  chartsConfig: PropTypes.array.isRequired,
};

export default ChartCarousel;
