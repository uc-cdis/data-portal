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
        ['get', `trn_${date}`],
        -100,
        '#0d652d',
        -80,
        '#188038',
        -60,
        '#1e8e3e',
        -40,
        '#34a853',
        -20,
        '#81c995',
        0,
        '#FFF',
        1,
        '#EED322',
        20,
        '#DA9C20',
        40,
        '#B86B25',
        60,
        '#8B4225',
        80,
        '#850001',
      ],
      'fill-opacity': 0.6,
    },
  };
}

class MobilityLayerTrn extends React.Component {
  render() {
    return (
      <ReactMapGL.Source type='geojson' data={this.props.data}>
        <ReactMapGL.Layer id='trn_mobility_data' {...notIl(this.props.date)} layout={{ visibility: this.props.visibility }} />
      </ReactMapGL.Source>
    );
  }
}

MobilityLayerTrn.propTypes = {
  visibility: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  date: PropTypes.string.isRequired,
};

export default MobilityLayerTrn;
