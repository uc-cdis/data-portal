import React from 'react';
import PropTypes from 'prop-types';
import * as ReactMapGL from 'react-map-gl';

const notIl = {
  type: 'fill',
  filter: ['all'],
  layout: { visibility: 'visible' },
  paint: {
    'fill-color': [
      'interpolate',
      ['linear'],
      ['get', '20A'],
      0,
      '#FFF',
      1,
      '#F7F787',
      2,
      '#EED322',
      3,
      '#E6B71E',
      4,
      '#DA9C20',
      5,
      '#CA8323',
      6,
      '#B86B25',
      7,
      '#A25626',
      8,
      '#8B4225',
      9,
      '#850001',
    ],
    'fill-opacity': 0.75,
  },
};

class GagnonStrainLayer extends React.Component {
  render() {
    return (
      <ReactMapGL.Source type='geojson' data={this.props.data}>
        <ReactMapGL.Layer id={'strain-data'} {...notIl} layout={{ visibility: this.props.visibility }} />
      </ReactMapGL.Source>
    );
  }
}

GagnonStrainLayer.propTypes = {
  visibility: PropTypes.bool.isRequired,
  data: PropTypes.object.isRequired,
};

export default GagnonStrainLayer;
