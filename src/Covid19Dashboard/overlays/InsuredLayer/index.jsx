import React from 'react';
import PropTypes from 'prop-types';
import * as ReactMapGL from 'react-map-gl';

const dataLegend = {
  title: 'Percent Insured',
  source: {
    title: 'American Community Survey',
    link: 'https://www.census.gov/newsroom/press-kits/2020/acs-5-year.html',
  },
  stops: [
    [90, '#FFF'],
    [91, '#a8dab5'],
    [92, '#81c995'],
    [93, '#5bb974'],
    [94, '#34a853'],
    [95, '#1e8e3e'],
    [96, '#188038'],
    [97, '#0d652d'],
    [98, '#8B4225'],
    [99, '#850001'],
  ],
  mode: '%',
};

const dataLayer = {
  title: 'Percent Insured',
  id: 'D_insured_rate',
  type: 'fill',
  layout: { visibility: 'visible' },
  paint: {
    'fill-color': [
      'interpolate',
      ['linear'],
      ['get', 'Percent Health Insurance'],
      ...dataLegend.stops.flat(),
    ],
    'fill-opacity': 0.6,
  },
};

class InsuredLayer extends React.Component {
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

InsuredLayer.propTypes = {
  visibility: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
};

export { dataLegend };
export default InsuredLayer;
