import React from 'react';
import PropTypes from 'prop-types';
import * as ReactMapGL from 'react-map-gl';

const dataLegend = {
  title: 'Fully vaccinated rate',
  source: {
    title: 'IDPH',
    link: 'https://idph.illinois.gov/DPHPublicInformation/api/COVIDExport/GetZip',
  },
  stops: [
    [0, '#FFF'],
    [50, '#a8dab5'],
    [60, '#81c995'],
    [70, '#5bb974'],
    [80, '#34a853'],
    [85, '#1e8e3e'],
    [90, '#0d652d'],
    [95, '#0b4225'],
  ],
  mode: '%',
};

const dataLayer = {
  id: 'V_first_dose_rate',
  type: 'fill',
  layout: { visibility: 'visible' },
  beforeId: 'zipcode-outline',
  paint: {
    'fill-color': [
      'interpolate',
      ['linear'],
      ['get', 'FirstDoseRate'],
      ...dataLegend.stops.flat(),
    ],
  },
};

class VaccinatedFirstLayer extends React.Component {
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

VaccinatedFirstLayer.propTypes = {
  visibility: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
};

export { dataLegend };
export default VaccinatedFirstLayer;
