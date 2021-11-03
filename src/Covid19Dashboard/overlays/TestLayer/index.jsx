import React from 'react';
import PropTypes from 'prop-types';
import * as ReactMapGL from 'react-map-gl';

const dataLayer = {
  id: 'C_total_tested_count',
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
        1000,
        '#F7F787',
        2000,
        '#EED322',
        5000,
        '#E6B71E',
        10000,
        '#DA9C20',
        20000,
        '#CA8323',
        50000,
        '#B86B25',
        100000,
        '#A25626',
        200000,
        '#8B4225',
        500000,
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
