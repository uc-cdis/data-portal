import React from 'react';
import PropTypes from 'prop-types';
import * as ReactMapGL from 'react-map-gl';
import usCounties from './data/us_counties_il_pop.json';

/*
  Setting the style for the counties in Illinois.
  The filter selected all counties whose state == 'IL" and not named "CHICAGO" as
  this data file also has the boundaries for the City of Chicago

  The paint instruction will take the value of the population property
  for the county and set ir color based on that value.
 */

const ilByPopulation = {
  id: 'illinois-counties-with-population',
  type: 'fill',
  filter: ['all', ['!=', 'COUNTYNAME', 'CHICAGO'], ['==', 'STATE', 'IL']],
  layout: { visibility: 'visible' },
  paint: {
    'fill-color': [
      'interpolate',
      ['linear'],
      ['get', 'population'],
      0,
      '#FFF',
      500,
      '#F7F787',
      1000,
      '#EED322',
      5000,
      '#E6B71E',
      10000,
      '#DA9C20',
      20000,
      '#CA8323',
      30000,
      '#B86B25',
      50000,
      '#A25626',
      100000,
      '#8B4225',
      1400000,
      '#850001',
    ],
    'fill-opacity': 0.75,
  },
};

class PopulationIL extends React.Component {
  render() {
    return (
      <ReactMapGL.Source type='geojson' data={usCounties}>
        <ReactMapGL.Layer
          {...ilByPopulation}
          layout={{ visibility: this.props.visibility }}
        />
      </ReactMapGL.Source>
    );
  }
}

PopulationIL.propTypes = {
  visibility: PropTypes.bool.isRequired,
};

export default PopulationIL;
