import React from 'react';
import PropTypes from 'prop-types';
import * as ReactMapGL from 'react-map-gl';

const dataLegend = {
  title: 'Percent Unemployed',
  source: {
    title: 'something demographic',
    url: 'https://something.or.other.com',
  },
  stops: [
    [40, '#FFF'],
    [50, '#a8dab5'],
    [55, '#81c995'],
    [60, '#5bb974'],
    [70, '#34a853'],
    [75, '#1e8e3e'],
    [80, '#188038'],
    [85, '#0d652d'],
    [90, '#8B4225'],
    [95, '#850001'],
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

export { dataLayer };
export default UnemployedLayer;
