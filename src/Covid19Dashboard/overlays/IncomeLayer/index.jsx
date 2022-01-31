import React from 'react';
import PropTypes from 'prop-types';
import * as ReactMapGL from 'react-map-gl';

const dataLegend = {
  title: 'Median Household Income',
  source: {
    title: 'American Community Survey',
    link: 'https://www.census.gov/newsroom/press-kits/2020/acs-5-year.html',
  },
  stops: [
    [40000, '#FFF'],
    [50000, '#a8dab5'],
    [60000, '#81c995'],
    [70000, '#5bb974'],
    [80000, '#34a853'],
    [90000, '#1e8e3e'],
    [100000, '#188038'],
    [125000, '#0d652d'],
    [150000, '#8B4225'],
    [200000, '#850001'],
  ],
  mode: '$',
};

const dataLayer = {
  title: 'Median Household Income',
  id: 'D_income',
  type: 'fill',
  layout: { visibility: 'visible' },
  paint: {
    'fill-color': [
      'interpolate',
      ['linear'],
      ['get', 'Median Household Income'],
      ...dataLegend.stops.flat(),
    ],
    'fill-opacity': 0.6,
  },
};

class IncomeLayer extends React.Component {
  render() {
    return (
      <ReactMapGL.Source type='geojson' data={this.props.data}>
        <ReactMapGL.Layer
          {...dataLayer}
          layout={{ visibility: this.props.visibility }}
        />
      </ReactMapGL.Source>
    );
  }
}

IncomeLayer.propTypes = {
  visibility: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
};

export { dataLegend };
export default IncomeLayer;
