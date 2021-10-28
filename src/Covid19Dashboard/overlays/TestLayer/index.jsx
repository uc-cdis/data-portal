import React from 'react';
import PropTypes from 'prop-types';
import * as ReactMapGL from 'react-map-gl';

const dataLayer = {
  id: 'total_tested_total',
  type: 'fill',
  layout: { visibility: 'visible' },
  beforeId: 'zipcode-outline',
  paint: {
    'fill-color': [
      'interpolate',
      ['linear'],
      ['get', 'total_tested'],
	0,
        '#FFF',
        5,
        '#F7F787',
        10,
        '#EED322',
        50,
        '#E6B71E',
        100,
        '#DA9C20',
        150,
        '#CA8323',
        200,
        '#B86B25',
        250,
        '#A25626',
        300,
        '#8B4225',
        350,
        '#850001',
      ],
  },
}

class TestLayer extends React.Component {
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

TestLayer.propTypes = {
  visibility: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
};

export default TestLayer;
