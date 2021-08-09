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
  filter: ['all', ['!=', 'STATE', 'IL']], // filter by selecting all states != 'IL'
  layout: { visibility: 'visible' }, // everything visible by default
  paint: {
    'fill-color': 'rgba(118, 103, 103, 1)',
    'fill-opacity': 0.3,
    'fill-outline-color': 'rgba(0, 0, 0, 1)',
  },
};

// LayerTemplate consist of a data source
// and layer which is used to render the data using
// the associated style
class LayerTemplate extends React.Component {
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
      <ReactMapGL.Source type='geojson' data={usCounties}>
        <ReactMapGL.Layer {...notIl} layout={{ visibility: this.props.visibility }} />
      </ReactMapGL.Source>
    );
  }
}

LayerTemplate.propTypes = {
  visibility: PropTypes.bool.isRequired,
};

export default LayerTemplate;
