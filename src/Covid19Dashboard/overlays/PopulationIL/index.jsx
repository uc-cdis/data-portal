import React from 'react';
import PropTypes from 'prop-types';
import * as ReactMapGL from 'react-map-gl';

const dataLayer = {
  id: 'D_illinois-zipcodes-with-population',
  type: 'fill',
  layout: { visibility: 'visible' },
  paint: {
    'fill-color': [
      'interpolate',
      ['linear'],
      ['get', 'Total Population'],
      0,
      '#FFF',
      500,
      '#F7F787',
      1000,
      '#EED322',
      5000,
      '#E6B71E',
      10000,
      '#DA9C20',
      20000,
      '#CA8323',
      30000,
      '#B86B25',
      50000,
      '#A25626',
      100000,
      '#8B4225',
      1400000,
      '#850001',
    ],
    'fill-opacity': 0.6,
  },
};

class PopulationIL extends React.Component {
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

PopulationIL.propTypes = {
  visibility: PropTypes.string.isRequired,
  data:	PropTypes.object.isRequired,
};

export default PopulationIL;
