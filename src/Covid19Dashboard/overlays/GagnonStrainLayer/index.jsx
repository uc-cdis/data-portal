import React from 'react';
import PropTypes from 'prop-types';
import * as ReactMapGL from 'react-map-gl';
import usCounties from '../PopulationIL/data/us_counties_il_pop.json';

/*
  Use Mapbox filters to selection all counties not in Illinois and render them
  in transparent grey.
  The filter will select all counties not in the state of IL
 */
const notIl = {
  type: 'fill',
  filter: ['all'], // filter by selecting all states != 'IL'
  layout: { visibility: 'visible' }, // everything visible by default
  paint: {
    'fill-color': [
      'interpolate',
      ['linear'],
      ['get', '20A'],
      0,
      '#FFF',
      1,
      '#F7F787',
      2,
      '#EED322',
      3,
      '#E6B71E',
      4,
      '#DA9C20',
      5,
      '#CA8323',
      6,
      '#B86B25',
      7,
      '#A25626',
      8,
      '#8B4225',
      9,
      '#850001',
    ],
    'fill-opacity': 0.75,
  },
};

// LayerTemplate consist of a data source
// and layer which is used to render the data using
// the associated style
class GagnonStrainLayer extends React.Component {
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
        <ReactMapGL.Layer id={'strain-data'} {...notIl} layout={{ visibility: this.props.visibility }} />
      </ReactMapGL.Source>
    );
  }
}

GagnonStrainLayer.propTypes = {
  visibility: PropTypes.bool.isRequired,
  data: PropTypes.object.isRequired,
};

export default GagnonStrainLayer;
