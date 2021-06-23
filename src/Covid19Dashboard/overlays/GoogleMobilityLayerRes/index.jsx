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
        ['get', `res_${date}`],
        -100,
        '#FFF',
        -80,
        '#F7F787',
        -60,
        '#EED322',
        -40,
        '#E6B71E',
        -20,
        '#DA9C20',
        0,
        '#CA8323',
        20,
        '#B86B25',
        40,
        '#A25626',
        60,
        '#8B4225',
        80,
        '#850001',
      ],
      'fill-opacity': 0.6,
    },
  };
}

class MobilityLayerRes extends React.Component {
  render() {
    return (
      <ReactMapGL.Source type='geojson' data={this.props.data}>
        <ReactMapGL.Layer id='res_mobility_data' {...notIl(this.props.date)} layout={{ visibility: this.props.visibility }} />
      </ReactMapGL.Source>
    );
  }
}

MobilityLayerRes.propTypes = {
  visibility: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  date: PropTypes.string.isRequired,
};

export default MobilityLayerRes;
