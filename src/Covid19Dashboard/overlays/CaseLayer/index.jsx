import React from 'react';
import PropTypes from 'prop-types';
import * as ReactMapGL from 'react-map-gl';

const dataLayer = {
  id: 'confirmed_cases_total',
  type: 'fill',
  layout: { visibility: 'visible' },
  beforeId: 'zipcode-outline',
  paint: {
    'fill-color': [
      'interpolate',
      ['linear'],
      ['get', 'confirmed_cases'],
	0,
        '#FFF',
        25,
        '#F7F787',
        50,
        '#EED322',
        100,
        '#E6B71E',
        250,
        '#DA9C20',
        500,
        '#CA8323',
        1000,
        '#B86B25',
        2500,
        '#A25626',
        5000,
        '#8B4225',
        10000,
        '#850001',
      ],
  },
}

class CaseLayer extends React.Component {
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

CaseLayer.propTypes = {
  visibility: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
};

export default CaseLayer;
