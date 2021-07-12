import React from 'react';
import PropTypes from 'prop-types';
import * as ReactMapGL from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import { mapboxAPIToken } from '../../localconf';
import ControlPanel from '../ControlPanel';
import countyData from '../data/us_counties';
/*
// Additional layers used as examples enable here
import LayerTemplate from '../overlays/LayerTemplate';
import PopulationIL from '../overlays/PopulationIL'; */

function addDataToGeoJsonBase(data) {
  // Only select Illinois data.
  // Chicago (FIPS 17999) is separate from Cook county in `countyData`,
  // but not in JHU data. So don't display Chicago separately.
  const base = {
    ...countyData,
    features: countyData.features.filter((f) => f.properties.STATE === 'IL' && f.properties.FIPS !== '17999'),
  };
  const geoJson = {
    ...base,
    features: base.features.map((loc) => {
      const location = loc;
      if (location.properties.FIPS && !(location.properties.FIPS in data)) {
        // `countyData` stores FIPS with trailing zeros, JHU data doesn't
        location.properties.FIPS = Number(location.properties.FIPS).toString();
      }
      if (location.properties.FIPS && location.properties.FIPS in data) {
        location.properties = Object.assign(
          data[location.properties.FIPS],
          location.properties,
        );
        return location;
      }

      // no data for this location
      location.properties.confirmed = 0;
      location.properties.deaths = 0;
      return location;
    }),
  };

  return geoJson;
}

function filterCountyGeoJson(selectedFips) {
  return {
    ...countyData,
    features: countyData.features.filter((f) => f.properties.STATE === 'IL' && f.properties.FIPS !== '17999' && selectedFips.includes(f.properties.FIPS)),
  };
}

class IllinoisMapChart extends React.Component {
  constructor(props) {
    super(props);
    this.choroCountyGeoJson = null;
    this.state = {
      mapSize: {
        width: '100%',
        height: '100%',
      },
      viewport: {
        // start centered on Chicago
        longitude: -90,
        latitude: 40,
        zoom: 6,
        bearing: 0,
        pitch: 0,
      },
      hoverInfo: null,
      overlay_layers: {
        us_counties: { title: 'US Counties', visible: 'visible' },
        il_population: { title: 'IL Population', visible: 'visible' },
      },
    };
    this.mapData = {
      modeledCountyGeoJson: null,
      colors: {},
      colorsAsList: null,
    };
  }

  componentDidUpdate() {
    if (!(this.mapData.colorsAsList === null
      && Object.keys(this.props.jsonByLevel.county).length > 0)) {
      return;
    }
    if (Object.keys(this.props.jsonByLevel.country).length && !this.choroCountyGeoJson) {
      this.choroCountyGeoJson = addDataToGeoJsonBase(
        this.props.jsonByLevel.county,
      );
    }
    this.mapData.modeledCountyGeoJson = filterCountyGeoJson(this.props.modeledFipsList);

    // Finds second highest value in data set
    // Second highest value is used to better balance distribution
    // Due to cook county being an extreme outlier
    const maxVal = this.mapData.modeledCountyGeoJson.features
      .map((obj) => {
        const confirmedCases = obj.properties.confirmed;
        // this is to handle <5 strings in dataset, makes it 0
        if (typeof confirmedCases === 'string') {
          return 0;
        }
        return confirmedCases;
      })
      .sort((a, b) => b - a)[1];// returning second highest value
    // check if maxVal is a number
    if (typeof maxVal !== 'number') {
      return;
    }
    const maxValExponent = Math.log10(maxVal);

    // Math to calculate Index range for map
    const colorRangeMath = (base) => {
      // applies maxValExponent to base then rounds down to greatest place
      const tempNum = Math.ceil(base ** maxValExponent);
      const roundingDigits = 10 ** (tempNum.toString().length - 1);

      return Math.floor(tempNum / roundingDigits) * roundingDigits;
    };

    this.mapData.colors = {
      0: '#FFF',
      [colorRangeMath(2)]: '#F7F787',
      [colorRangeMath(3)]: '#EED322',
      [colorRangeMath(4)]: '#E6B71E',
      [colorRangeMath(5)]: '#DA9C20',
      [colorRangeMath(6)]: '#CA8323',
      [colorRangeMath(7)]: '#B86B25',
      [colorRangeMath(8)]: '#A25626',
      [colorRangeMath(9)]: '#8B4225',
      [colorRangeMath(10)]: '#850001',
    };
    this.mapData.colorsAsList = Object.entries(this.mapData.colors)
      .map((item) => [+item[0], item[1]]).flat();
  }

  onHover = (event) => {
    if (!event.features) { return; }

    let hoverInfo = null;
    const formatNumberToDisplay = (rawNum) => {
      if (rawNum && rawNum !== 'null') {
        if (typeof rawNum === 'number') {
          return rawNum.toLocaleString();
        }
        return rawNum;
      }
      // Default if missing
      return 0;
    };

    event.features.forEach((feature) => {
      if (feature.layer.id !== 'confirmed-choropleth') {
        return;
      }
      const confirmed = formatNumberToDisplay(feature.properties.confirmed);
      const deaths = formatNumberToDisplay(feature.properties.deaths);
      const recovered = formatNumberToDisplay(feature.properties.recovered);

      const state = feature.properties.STATE;
      const county = feature.properties.COUNTYNAME;
      let locationName = 'US';
      locationName = (state && state !== 'null' ? `${state}, ` : '') + locationName;
      locationName = (county && county !== 'null' ? `${county}, ` : '') + locationName;
      hoverInfo = {
        lngLat: event.lngLat,
        locationName,
        FIPS: feature.properties.FIPS,
        values: {
          'confirmed cases': confirmed,
          deaths,
        },
      };
      if (recovered) {
        hoverInfo.values.recovered = recovered;
      }
    });

    this.setState({
      hoverInfo,
    });
  };

  onClick = (event) => {
    if (!event.features) { return; }

    event.features.forEach((feature) => {
      if (feature.layer.id === 'confirmed-choropleth') {
        const title = `${feature.properties.county}, ${feature.properties.province_state}`;
        this.props.fetchTimeSeriesData(
          'county',
          feature.properties.FIPS,
          title,
          this.props.modeledFipsList.includes(feature.properties.FIPS),
        );
      }
    });
  }

  onLayerSelect = (event, id) => {
    const newState = { ...this.state.overlay_layers };
    newState[id].visible = event.target.checked ? 'visible' : 'none';
    this.setState(newState);
  }

  renderHoverPopup() {
    const { hoverInfo } = this.state;
    if (hoverInfo) {
      return (
        <ReactMapGL.Popup
          longitude={hoverInfo.lngLat[0]}
          latitude={hoverInfo.lngLat[1]}
          closeButton={false}
        >
          <div className='location-info'>
            <h4>
              {hoverInfo.locationName}
            </h4>
            {
              Object.entries(hoverInfo.values).map(
                (val, i) => <p key={i}>{`${val[1]} ${val[0]}`}</p>,
              )
            }
            <p className='covid19-dashboard__location-info__click'>
              Click for real time plotting {this.props.modeledFipsList.includes(hoverInfo.FIPS) ? '\nand simulations' : ''}
            </p>
          </div>
        </ReactMapGL.Popup>
      );
    }
    return null;
  }

  render() {
    return (
      <div className='map-chart map-chart-il'>
        <ControlPanel
          showMapStyle={false}
          showLegend
          colors={this.mapData.colors}
          lastUpdated={this.props.jsonByLevel.last_updated}
          /*
          // Additional layers used as examples enable here
          layers={this.state.overlay_layers}
          onLayerSelectChange={this.onLayerSelect}
          */
        />
        <ReactMapGL.InteractiveMap
          className='.map-chart__mapgl-map'
          mapboxApiAccessToken={mapboxAPIToken}
          mapStyle='mapbox://styles/mapbox/streets-v11'
          {...this.state.viewport}
          {...this.state.mapSize} // after viewport to avoid size overwrite
          onViewportChange={(viewport) => {
            this.setState({ viewport });
          }}
          onHover={this.onHover}
          onClick={this.onClick}
          dragRotate={false}
          touchRotate={false}
        >
          {this.renderHoverPopup()}

          <ReactMapGL.Source type='geojson' data={this.choroCountyGeoJson}>
            <ReactMapGL.Layer
              id='confirmed-choropleth'
              type='fill'
              beforeId='waterway-label'
              paint={this.mapData.colorsAsList === null ? {} : {
                'fill-color': [
                  'interpolate',
                  ['linear'],
                  ['number', ['get', 'confirmed'], 0],
                  ...this.mapData.colorsAsList,
                ],
                'fill-opacity': 0.6,
              }}
            />
          </ReactMapGL.Source>

          {/* Outline a set of counties */}
          <ReactMapGL.Source type='geojson' data={this.mapData.modeledCountyGeoJson}>
            <ReactMapGL.Layer
              id='county-outline'
              type='line'
              beforeId='waterway-label'
              paint={{
                'line-color': '#421C52',
                'line-width': 1.5,
              }}
            />
          </ReactMapGL.Source>
          {/*
          // Additional layers used as examples enable here
          <LayerTemplate visibility={this.state.overlay_layers.us_counties.visible} />
          <PopulationIL visibility={this.state.overlay_layers.il_population.visible} /> */}
        </ReactMapGL.InteractiveMap>
      </div>
    );
  }
}

IllinoisMapChart.propTypes = {
  jsonByLevel: PropTypes.object.isRequired,
  modeledFipsList: PropTypes.array.isRequired,
  fetchTimeSeriesData: PropTypes.func.isRequired,
};

export default IllinoisMapChart;
