import React from 'react';
import PropTypes from 'prop-types';
import * as ReactMapGL from 'react-map-gl';

function notIl(date) {
  return {
    type: 'fill',
    filter: ['all'],
    layout: { visibility: 'visible' },
    beforeId: 'county-outline',
    paint: {
      'fill-color': [
        'interpolate',
        ['linear'],
        ['get', `V_${date}`],
        1000,
        '#FFF',
        5000,
        '#a8dab5',
        10000,
        '#81c995',
        50000,
        '#5bb974',
        100000,
        '#34a853',
        150000,
        '#1e8e3e',
        300000,
        '#188038',
        500000,
        '#0d652d',
      ],
      'fill-opacity': 0.6,
    },
  };
}

class VaccinatedCaseLayer extends React.Component {
  render() {
    return (
      <ReactMapGL.Source type='geojson' data={this.props.data}>
        <ReactMapGL.Layer id='V_time_data' {...notIl(this.props.date)} layout={{ visibility: this.props.visibility }} />
      </ReactMapGL.Source>
    );
  }
}

VaccinatedCaseLayer.propTypes = {
  visibility: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  date: PropTypes.string.isRequired,
};

export default VaccinatedCaseLayer;
