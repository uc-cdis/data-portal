import React from 'react';
import PropTypes from 'prop-types';
import * as ReactMapGL from 'react-map-gl';

const dataLayer = {
  id: 'FullyVaccinatedRate',
  type: 'fill',
  layout: { visibility: 'visible' },
  beforeId: 'zipcode-outline',
  paint: {
    'fill-color': [
      'interpolate',
      ['linear'],
      ['get', 'FullyVaccinatedRate'],
	30,
        '#FFF',
        40,
        '#a8dab5',
        45,
        '#81c995',
        50,
        '#5bb974',
        55,
        '#34a853',
        60,
        '#1e8e3e',
        65,
        '#188038',
        70,
        '#0d652d',
        75,
        '#8B4225',
        100,
        '#850001',
      ],
  },
}

class VaccinatedFullLayer extends React.Component {
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

VaccinatedFullLayer.propTypes = {
  visibility: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
};

export default VaccinatedFullLayer;
