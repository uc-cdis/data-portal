import React from 'react';
import PropTypes from 'prop-types';
import * as ReactMapGL from 'react-map-gl';

const dataLegend = {
  title: 'Confirmed Cases',
  source: {
    title: 'Cases & Testing',
    url: 'https://idph.illinois.gov/DPHPublicInformation/api/COVIDExport/GetZip',
  },
  stops: [
    [0, '#FFF'],
    [50, '#F7F787'],
    [100, '#EED322'],
    [250, '#E6B71E'],
    [500, '#DA9C20'],
    [1000, '#CA8323'],
    [2000, '#B86B25'],
    [5000, '#A25626'],
    [7500, '#8B4225'],
    [10000, '#850001'],
  ],
};

const dataLayer = {
  id: 'C_confirmed_cases_count',
  type: 'fill',
  layout: { visibility: 'visible' },
  beforeId: 'zipcode-outline',
  paint: {
    'fill-color': [
      'interpolate',
      ['linear'],
      ['get', 'confirmed_cases'],
      ...dataLegend.stops.flat(),
    ],
  },
};

class CaseLayer extends React.Component {
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

CaseLayer.propTypes = {
  visibility: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
};

export { dataLegend };
export default CaseLayer;
