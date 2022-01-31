import React from 'react';
import PropTypes from 'prop-types';
import * as ReactMapGL from 'react-map-gl';

const dataLegend = {
  title: 'COVID-19 Tests Perfomed',
  source: {
    title: 'IDPH',
    link: 'https://idph.illinois.gov/DPHPublicInformation/api/COVIDExport/GetZip',
  },
  stops: [
    [0, '#FFF'],
    [1000, '#a8dab5'],
    [5000, '#81c995'],
    [10000, '#5bb974'],
    [50000, '#34a853'],
    [100000, '#1e8e3e'],
    [500000, '#0d652d'],
    [1000000, '#0b4225'],
  ],
  mode: '',
};

const dataLayer = {
  id: 'C_total_tested_count',
  type: 'fill',
  layout: { visibility: 'visible' },
  beforeId: 'zipcode-outline',
  paint: {
    'fill-color': [
      'interpolate',
      ['linear'],
      ['get', 'total_tested'],
      ...dataLegend.stops.flat(),
    ],
  },
};

class TestLayer extends React.Component {
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

TestLayer.propTypes = {
  visibility: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
};

export { dataLegend };
export default TestLayer;
