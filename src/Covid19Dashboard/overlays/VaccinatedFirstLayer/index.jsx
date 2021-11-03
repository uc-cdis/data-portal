import React from 'react';
import PropTypes from 'prop-types';
import * as ReactMapGL from 'react-map-gl';

const dataLayer = {
  id: 'V_first_dose_rate',
  type: 'fill',
  layout: { visibility: 'visible' },
  beforeId: 'zipcode-outline',
  paint: {
    'fill-color': [
      'interpolate',
      ['linear'],
      ['get', 'FirstDoseRate'],
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

class VaccinatedFirstLayer extends React.Component {
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

VaccinatedFirstLayer.propTypes = {
  visibility: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
};

export default VaccinatedFirstLayer;
