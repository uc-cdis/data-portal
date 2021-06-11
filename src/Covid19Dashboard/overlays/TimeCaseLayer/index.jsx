import React from 'react';
import PropTypes from 'prop-types';
import * as ReactMapGL from 'react-map-gl';
import usCounties from '../PopulationIL/data/us_counties_il_pop.json';

/*
  Use Mapbox filters to selection all counties not in Illinois and render them
  in transparent grey.
  The filter will select all counties not in the state of IL
 */
function notIl(date) {
  // console.log(date);
  return {
    type: 'fill',
    filter: ['all'], // filter by selecting all states != 'IL'
    layout: { visibility: 'visible' }, // everything visible by default
    beforeId: 'waterway-label',
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

// LayerTemplate consist of a data source
// and layer which is used to render the data using
// the associated style
class TimeCaseLayer extends React.Component {
  // additional additional initial code code here.
  // If you do uncomment the constructor below
  /*
  constructor(props) {
    super(props);
  }
  */

  // Set the data source (geojson) and
  // the layer used to render and toggle visibility
  // NOTE: the layout prop must appear after the style

  render() {
    // console.log(this.props.data);
    return (
      <ReactMapGL.Source type='geojson' data={this.props.data}>
        <ReactMapGL.Layer id='time-data' {...notIl(this.props.date)} layout={{ visibility: this.props.visibility }} />
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
