import React from 'react';
import PropTypes from 'prop-types';
import * as ReactMapGL from 'react-map-gl';
import usCounties from '../PopulationIL/data/us_counties_il_pop.json';

/*
  Use Mapbox filters to selection all counties not in Illinois and render them
  in transparent grey.
  The filter will select all counties not in the state of IL
 */
function notIl (date) {
    // console.log(date);
    return {
    type: 'fill',
    filter: ['all'], // filter by selecting all states != 'IL'
    layout: { visibility: 'visible' }, // everything visible by default
    beforeId: 'county-outline',
    paint: {
      'fill-color': [
        'interpolate',
        ['linear'],
        ['get', `gnp_${date}`],
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
  }};

// LayerTemplate consist of a data source
// and layer which is used to render the data using
// the associated style
class MobilityLayerGnp extends React.Component {
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
    return (
      <ReactMapGL.Source type='geojson' data={this.props.data}>
        <ReactMapGL.Layer id='gnp_mobility_data' {...notIl(this.props.date)} layout={{ visibility: this.props.visibility }}/>
      </ReactMapGL.Source>
    );
  }
}

MobilityLayerGnp.propTypes = {
  visibility: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  date: PropTypes.string.isRequired,
};

export default MobilityLayerGnp;
