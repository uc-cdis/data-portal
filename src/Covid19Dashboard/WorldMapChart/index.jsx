import React from 'react';
import PropTypes from 'prop-types';
import * as ReactMapGL from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import { mapboxAPIToken } from '../../localconf';
import ControlPanel from '../ControlPanel';
import worldData from '../data/world_50m'; // from https://geojson-maps.ash.ms
import stateData from '../data/us_states_20m.json'; // from https://eric.clst.org/tech/usgeojson/
import countyData from '../data/us_counties';

function addDataToGeoJsonBase(data, dataLevel) {
  // the base GeoJson describes the country/state/county borders.
  let base = stateData;
  if (dataLevel === 'country') {
    base = worldData;
    worldData.features.forEach((f) => {
      if (f.properties.name === 'Greenland') {
        // Greenland is part of Denmark in JHU data, but not in `worldData`.
        // Override Greenland's ISO code to be the same as Denmark.
        f.properties.iso_a3 = 'DNK'; // eslint-disable-line no-param-reassign
      }
    });
  } else if (dataLevel === 'county') {
    const newYorkFips = '36061';
    const emptyNewYorkFips = ['36081', '36047', '36005', '36085'];
    base = {
      ...countyData,
      features: countyData.features.filter((f) => {
        if (f.properties.FIPS === '17999') {
          // Chicago (FIPS 17999) is separate from Cook county in
          // `countyData`, but not in JHU data. So don't display
          // Chicago separately:
          return false;
        }
        if (emptyNewYorkFips.includes(f.properties.FIPS)) {
          // JHU data contains all NY counts in county "New York". Counties
          // "Queens", "Kings", "Richmond" and "Bronx" contain empty counts.
          // So display the whole NY area with "New York" counts:
          f.properties.FIPS = newYorkFips; // eslint-disable-line no-param-reassign
        }
        return true;
      }),
    };
  }

  // add the JHU data to the base GeoJson.
  const geoJson = {
    ...base,
    features: base.features.map((loc) => {
      const location = loc;
      if (
        dataLevel === 'country'
        && location.properties.iso_a3
        && location.properties.iso_a3 in data
      ) {
        location.properties = Object.assign(
          data[location.properties.iso_a3],
          location.properties,
        );
        return location;
      }

      if (
        dataLevel === 'state'
        && location.properties.NAME
        && location.properties.NAME in data
      ) {
        location.properties = Object.assign(
          data[location.properties.NAME],
          location.properties,
        );
        return location;
      }

      if (dataLevel === 'county') {
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
    features: countyData.features.filter((f) => f.properties.FIPS !== '17999' && selectedFips.includes(f.properties.FIPS)),
  };
}

class WorldMapChart extends React.Component {
  constructor(props) {
    super(props);
    this.choroCountryGeoJson = null;
    this.choroStateGeoJson = null;
    this.choroCountyGeoJson = null;
    this.state = {
      selectedLayer: 'confirmed-choropleth',
      mapSize: {
        width: '100%',
        height: '100%',
      },
      viewport: {
        longitude: 0,
        latitude: 10,
        zoom: 1,
        bearing: 0,
        pitch: 0,
      },
      hoverInfo: null,
    };
    this.mapData = {
      modeledCountyGeoJson: null,
      densityGeoJson: null,
      colors: {},
      colorsAsList: null,
      dotSizesAsList: null,
    };
  }

  componentDidUpdate() {
    if (!(this.mapData.colorsAsList === null
      && Object.keys(this.props.jsonByLevel.county).length > 0)) {
      return;
    }
    this.mapData.densityGeoJson = this.props.geoJson;
    if (Object.keys(this.props.jsonByLevel.country).length && !this.choroCountryGeoJson) {
      this.choroCountryGeoJson = addDataToGeoJsonBase(
        this.props.jsonByLevel.country,
        'country',
      );
      this.choroStateGeoJson = addDataToGeoJsonBase(
        this.props.jsonByLevel.state,
        'state',
      );
      this.choroCountyGeoJson = addDataToGeoJsonBase(
        this.props.jsonByLevel.county,
        'county',
      );
    }
    this.mapData.modeledCountyGeoJson = filterCountyGeoJson(this.props.modeledFipsList);

    // Finds max value in data set
    // returning highest value
    const maxCountryVal = Math.max(...this.props.geoJson.features
      .map((obj) => {
        const confirmedCases = obj.properties.confirmed;
        // this is to handle <5 strings in dataset, makes it 0
        if (typeof confirmedCases === 'string') {
          return 0;
        }
        return confirmedCases;
      }));
    // check if maxCountryVal is a number
    if (typeof maxCountryVal !== 'number') {
      return;
    }
    // Finds its base 10 exponent
    const maxValExponent = Math.log10(maxCountryVal);

    // Math to calculate Index range for map
    const colorRangeMath = (base) => {
      // applies maxValExponent to base then rounds down to greatest place
      const tempNum = Math.ceil(base ** maxValExponent);
      const roundingDigits = 10 ** (tempNum.toString().length - 1);

      return Math.floor(tempNum / roundingDigits) * roundingDigits;
    };

    // config for dot distribution map
    const dotSizes = {
      0: 2,
      [colorRangeMath(2)]: 5,
      [colorRangeMath(3)]: 8,
      [colorRangeMath(4)]: 11,
      [colorRangeMath(5)]: 15,
      [colorRangeMath(6)]: 19,
      [colorRangeMath(7)]: 23,
      [colorRangeMath(8)]: 27,
    };

    this.mapData.dotSizesAsList = Object.entries(dotSizes).map((item) => [+item[0], item[1]]).flat();

    // config for choropleth map
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
      if (!feature.layer.id.startsWith('confirmed-')) {
        return;
      }
      const confirmed = formatNumberToDisplay(feature.properties.confirmed);
      const deaths = formatNumberToDisplay(feature.properties.deaths);
      const recovered = formatNumberToDisplay(feature.properties.recovered);

      const state = feature.properties.province_state;
      const { county } = feature.properties;
      let locationName = feature.properties.country_region;
      locationName = (state && state !== 'null' ? `${state}, ` : '') + locationName;
      locationName = (county && county !== 'null' ? `${county}, ` : '') + locationName;
      if (!locationName || locationName === 'undefined') {
        // we don't have data for this location
        return;
      }
      hoverInfo = {
        lngLat: event.lngLat,
        locationName,
        // density map data contains fips;
        // choropleth map data contains FIPS.
        FIPS: `${feature.properties.FIPS || feature.properties.fips}`,
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

    let dataLevel = null;
    let locationId = '';
    let title = '';
    event.features.forEach((feature) => {
      const layerId = feature.layer.id;
      if (!layerId.startsWith('confirmed-')) {
        return;
      }

      // density map data contains fips and iso3;
      // choropleth map data contains FIPS and iso_a3.
      let fips = feature.properties.FIPS || feature.properties.fips;
      fips = typeof fips !== 'undefined' ? `${fips}` : fips;
      const state = feature.properties.province_state;
      const iso3 = feature.properties.iso_a3 || feature.properties.iso3;
      const isUS = iso3 === 'USA' || feature.properties.country_region === 'US';

      // for US: only get the most granular data
      // for other countries: always get the country-level data
      if (fips && isUS) {
        dataLevel = 'county';
        locationId = fips;
        title = `${feature.properties.county}, ${state}, ${feature.properties.country_region}`;
      } else if (state && isUS && dataLevel !== 'county') {
        dataLevel = 'state';
        locationId = state;
        title = `${state}, ${feature.properties.country_region}`;
      } else if (iso3 && !dataLevel) {
        dataLevel = 'country';
        locationId = iso3;
        title = `${feature.properties.country_region}`;
      }
    });

    if (dataLevel) {
      const withSimulation = dataLevel === 'county' && this.props.modeledFipsList.includes(locationId);
      this.props.fetchTimeSeriesData(dataLevel, locationId, title, withSimulation);
    }
  }

  isVisible(layerId) {
    if (this.state.selectedLayer === layerId) {
      return 'visible';
    }
    return 'none';
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
    const stateZoomThreshold = 1.5;
    const countyZoomThreshold = 3;
    return (
      <div className='map-chart'>
        <ControlPanel
          showMapStyle
          defaultMapStyle={this.state.selectedLayer}
          onMapStyleChange={(layerId) => { this.setState({ selectedLayer: layerId }); }}
          showLegend={this.state.selectedLayer !== 'confirmed-dots'}
          colors={this.mapData.colors}
          lastUpdated={this.props.jsonByLevel.last_updated}
        />
        <ReactMapGL.InteractiveMap
          className='map-chart__mapgl-map'
          mapboxApiAccessToken={mapboxAPIToken}
          mapStyle='mapbox://styles/mapbox/streets-v11'
          {...this.state.viewport}
          {...this.state.mapSize} // after viewport to avoid size overwrite
          minZoom={1}
          onViewportChange={(viewport) => {
            this.setState({ viewport });
          }}
          onHover={this.onHover}
          onClick={this.onClick}
          dragRotate={false}
          touchRotate={false}
        >
          {this.renderHoverPopup()}

          {/* Dot distribution map */}
          <ReactMapGL.Source
            type='geojson'
            data={this.mapData.densityGeoJson}
          >
            <ReactMapGL.Layer
              id='confirmed-dots'
              layout={{ visibility: this.isVisible('confirmed-dots') }}
              type='circle'
              paint={this.mapData.dotSizesAsList === null ? {} : {
                'circle-radius': [
                  'interpolate',
                  ['linear'],
                  ['number', ['get', 'confirmed'], 0],
                  ...this.mapData.dotSizesAsList,
                ],
                'circle-color': [
                  'interpolate',
                  ['linear'],
                  ['number', ['get', 'confirmed'], 0],
                  0, '#AA5E79',
                ],
                'circle-opacity': 0.8,
              }}
            />
          </ReactMapGL.Source>

          <ReactMapGL.Source type='geojson' data={this.choroCountryGeoJson}>
            {/* Choropleth map when zoomed out: country-level data only */}
            <ReactMapGL.Layer
              id='confirmed-choro-country'
              layout={{ visibility: this.isVisible('confirmed-choropleth') }}
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
              maxzoom={stateZoomThreshold}
            />
          </ReactMapGL.Source>

          {/* Same source as the previous one, but masking 1 layer out of 2
          layers in the same source depending on zoom is causing issues */}
          <ReactMapGL.Source type='geojson' data={this.choroCountryGeoJson}>
            {/* Choropleth map when zoomed in (state or county zoom):
            country-level data for all countries except US */}
            <ReactMapGL.Layer
              id='confirmed-choro-country-except-us'
              layout={{ visibility: this.isVisible('confirmed-choropleth') }}
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
              minzoom={stateZoomThreshold}
              filter={['!=', 'country_region', 'US']}
            />
          </ReactMapGL.Source>

          <ReactMapGL.Source type='geojson' data={this.choroStateGeoJson}>
            {/* Choropleth map when zoomed in (state zoom): display state-level US data */}
            <ReactMapGL.Layer
              id='confirmed-choro-state'
              layout={{ visibility: this.isVisible('confirmed-choropleth') }}
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
              minzoom={stateZoomThreshold}
              maxzoom={countyZoomThreshold}
            />
          </ReactMapGL.Source>

          <ReactMapGL.Source type='geojson' data={this.choroCountyGeoJson}>
            {/* Choropleth map when zoomed in (county zoom): display county-level US data */}
            <ReactMapGL.Layer
              id='confirmed-choro-county'
              layout={{ visibility: this.isVisible('confirmed-choropleth') }}
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
              minzoom={countyZoomThreshold}
            />
          </ReactMapGL.Source>

          {/* Outline a set of counties */}
          <ReactMapGL.Source type='geojson' data={this.mapData.modeledCountyGeoJson}>
            <ReactMapGL.Layer
              id='county-outline'
              layout={{ visibility: this.isVisible('confirmed-choropleth') }}
              type='line'
              beforeId='waterway-label'
              paint={{
                'line-color': '#421C52',
                'line-width': 1.5,
              }}
              minzoom={countyZoomThreshold}
            />
          </ReactMapGL.Source>
        </ReactMapGL.InteractiveMap>
      </div>
    );
  }
}

WorldMapChart.propTypes = {
  geoJson: PropTypes.object.isRequired,
  jsonByLevel: PropTypes.object.isRequired,
  modeledFipsList: PropTypes.array.isRequired,
  fetchTimeSeriesData: PropTypes.func.isRequired,
};

export default WorldMapChart;
