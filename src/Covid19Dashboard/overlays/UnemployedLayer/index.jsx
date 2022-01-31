import React from 'react';
import PropTypes from 'prop-types';
import * as ReactMapGL from 'react-map-gl';

const dataLegend = {
  title: 'Percent Unemployed',
  source: {
    title: 'American Community Survey',
    link: 'https://www.census.gov/newsroom/press-kits/2020/acs-5-year.html',
  },
  stops: [
    [2, '#FFF'],
    [4, '#a8dab5'],
    [6, '#81c995'],
    [8, '#5bb974'],
    [10, '#34a853'],
    [12, '#1e8e3e'],
    [14, '#188038'],
    [16, '#0d652d'],
    [18, '#8B4225'],
    [20, '#850001'],
  ],
  mode: '%',
};

const dataLayer = {
  id: 'D_unemployed_rate',
  type: 'fill',
  layout: { visibility: 'visible' },
  paint: {
    'fill-color': [
      'interpolate',
      ['linear'],
      ['get', 'Percent Unemployment'],
      2,
      '#FFF',
      4,
      '#a8dab5',
      6,
      '#81c995',
      8,
      '#5bb974',
      10,
      '#34a853',
      12,
      '#1e8e3e',
      14,
      '#188038',
      16,
      '#0d652d',
      18,
      '#8B4225',
      20,
      '#850001',
    ],
    'fill-opacity': 0.6,
  },
};

class UnemployedLayer extends React.Component {
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

UnemployedLayer.propTypes = {
  visibility: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
};

export { dataLegend };
export default UnemployedLayer;
