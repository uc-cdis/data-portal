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
        ['get', `C_${date}`],
        0,
        '#FFF',
        30,
        '#F7F787',
        200,
        '#EED322',
        900,
        '#E6B71E',
        2000,
        '#DA9C20',
        7000,
        '#CA8323',
        10000,
        '#B86B25',
        20000,
        '#A25626',
        50000,
        '#8B4225',
        80000,
        '#850001',
      ],
      'fill-opacity': 0.6,
    },
  };
}

class TimeCaseLayer extends React.Component {
  render() {
    return (
      <ReactMapGL.Source type='geojson' data={this.props.data}>
        <ReactMapGL.Layer id='time_data' {...notIl(this.props.date)} layout={{ visibility: this.props.visibility }} />
      </ReactMapGL.Source>
    );
  }
}

TimeCaseLayer.propTypes = {
  visibility: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  date: PropTypes.string.isRequired,
};

export default TimeCaseLayer;
