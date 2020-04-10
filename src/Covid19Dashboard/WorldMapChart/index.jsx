import React from 'react';
import PropTypes from 'prop-types';
import * as ReactMapGL from 'react-map-gl';

import ControlPanel from '../ControlPanel';

// downloaded from https://geojson-maps.ash.ms
import worldData from '../data/world';

import 'mapbox-gl/dist/mapbox-gl.css';
import './WorldMapChart.less';

const numberWithCommas = x => {
  return x ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 0;
}

class WorldMapChart extends React.Component {
  constructor(props) {
    super(props);
    this.updateDimensions = this.updateDimensions.bind(this);
    this.dotsGeoJson = null;
    this.choropGeoJson = null;
    this.state = {
      selectedLayer: 'confirmed-dots',
      mapSize: {
        width: '100%',
        height: window.innerHeight - 221,
      },
      viewport: {
        longitude: 0,
        latitude: 10,
        zoom: 1,
        bearing: 0,
        pitch: 0,
      },
      hoverInfo: null,
      selectedDate: props.rawData && props.rawData[0] ? new Date(Math.max.apply(null, props.rawData[0].date.map(date => new Date(date)))) : null,
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.rawData.length !== this.props.rawData.length) {
      this.setState({ selectedDate: nextProps.rawData && nextProps.rawData[0] ? new Date(Math.max.apply(null, nextProps.rawData[0].date.map(date => new Date(date)))) : null });
    }
  }

  // componentWillUnmount() {
  //   window.removeEventListener('resize', this.updateDimensions);
  // }

  updateDimensions() {
    this.setState({
      mapSize: { width: '100%', height: window.innerHeight - 221 }
    });
  }

  _onHover = (event) => {
    let hoverInfo = null;

    if (!event.features) { return; }

    event.features.forEach((feature) => {
      if (!['confirmed-dots', 'confirmed-choropleth'].includes(feature.layer.id)) {
        return;
      }
      let confirmed = feature.properties.confirmed;
      confirmed = confirmed && confirmed != 'null' ? confirmed : 0;
      let deaths = feature.properties.deaths;
      deaths = deaths && deaths != 'null' ? deaths : 0;

      const state = feature.properties.province_state;
      const county = feature.properties.county;
      let locationName = feature.properties.country_region;
      locationName = (state && state != 'null' ? `${state}, ` : '') + locationName
      locationName = (county && county != 'null' ? `${county}, ` : '') + locationName
      if (!locationName || locationName == 'undefined') {
        // we don't have data for this location
        return;
      }
      hoverInfo = {
        lngLat: event.lngLat,
        locationName: locationName,
        values: {
          "confirmed cases": numberWithCommas(confirmed),
          "deaths": numberWithCommas(deaths),
        }
      };
    });

    this.setState({
      hoverInfo,
    });
  };

  _renderHoverPopup() {
    const { hoverInfo } = this.state;
    if (hoverInfo) {
      return (
        <ReactMapGL.Popup longitude={hoverInfo.lngLat[0]} latitude={hoverInfo.lngLat[1]} closeButton={false}>
          <div className='location-info'>
            <h4>
              {hoverInfo.locationName}
            </h4>
            {
              Object.entries(hoverInfo.values).map(
                (val, i) => <p key={i}>{`${val[1]} ${val[0]}`}</p>
              )
            }
          </div>
        </ReactMapGL.Popup>
      );
    }
    return null;
  }

  convertRawDataToDict(rawData) {
    var filteredFeatures = {};
    rawData.reduce((res, location) => {
      if (location.project_id != 'open-JHU') {
        // we are getting _all_ the location data from Guppy because there
        // is no way to filter by project using the GuppyWrapper. So have
        // to filter on client side
        return res;
      }
      const selectedDateIndex = location.date.findIndex(x => new Date(x).getTime() === this.state.selectedDate.getTime());

      let confirmed = Number(location.confirmed[selectedDateIndex]);
      let deaths = Number(location.confirmed[selectedDateIndex]);
      if (!confirmed) {
        confirmed = 0;
      }
      if (!deaths) {
        deaths = 0;
      }
      if (location.iso3 in res) {
        // aggregation
        res[location.iso3].province_state = '';
        res[location.iso3].county = '';
        res[location.iso3].confirmed += confirmed;
        res[location.iso3].deaths += deaths;
      }
      else {
        res[location.iso3] = {
          country_region: location.country_region,
          province_state: location.province_state,
          county: location.county,
          confirmed: confirmed,
          deaths: deaths,
          allData: { ...location },
        }
      }
      return res;
    }, filteredFeatures);
    return filteredFeatures;
  }

  addDataToGeoJsonBase(data) {
    const geoJson = {
      ...worldData,
      features: worldData.features.map((location) => {
        if (location.properties.iso_a3 in data) {
          location.properties = Object.assign(
            location.properties,
            data[location.properties.iso_a3]
          )
        } else {
          location.properties.confirmed = 0;
          location.properties.allData = {};
        }
        return location;
      }),
    };

    return geoJson;
  }

  convertRawDataToGeoJson(rawData) {
    const features = rawData.reduce((res, location) => {
      const new_features = [];
      if (location.project_id != 'open-JHU') {
        // we are getting _all_ the location data from Guppy because there
        // is no way to filter by project using the GuppyWrapper. So have
        // to filter on client side
        return res;
      }
      location.date.forEach((date, i) => {
        if (new Date(date).getTime() != this.state.selectedDate.getTime()) {
          return;
        }

        const confirmed = location.confirmed[i];
        const deaths = location.deaths[i];
        const recovered = location.recovered[i];
        const testing = location.testing[i];
        const feature = {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [location.longitude, location.latitude],
          },
          properties: {
            country_region: location.country_region,
            province_state: location.province_state,
            county: location.county,
            date,
            'marker-symbol': 'monument',
            confirmed: confirmed != null ? (+confirmed) : 0,
            deaths: deaths != null ? (+deaths) : 0,
            recovered: recovered != null ? (+recovered) : 0,
            testing: testing != null ? (+testing) : 0,
          },
        };
        new_features.push(feature);
      });
      return res.concat(new_features);
    }, []);

    const geoJson = {
      type: 'FeatureCollection',
      features,
    };
    return geoJson;
  }

  _is_visible(layer_id){
    if (this.state.selectedLayer == layer_id) {
      return 'visible'
    }
    return 'none'
  }

  render() {
    const rawData = this.props.rawData;

    if (this.state.selectedLayer == 'confirmed-dots') {
      if (!this.dotsGeoJson || this.dotsGeoJson.features.length == 0) {
        this.dotsGeoJson = this.convertRawDataToGeoJson(rawData);
      }
    }
    else {
      if (!this.choropGeoJson || this.choropGeoJson.features.length == 0) {
        const geoJson = this.convertRawDataToDict(rawData);
        this.choropGeoJson = this.addDataToGeoJsonBase(geoJson);
      }
    }

    let colors = {0: '#FFF'}, dotSizes = {0: 0, 1: 2};
    // config for dot distribution map
    if (this.state.selectedLayer == 'confirmed-dots') {
      colors = {
        0: '#FFF',
        1: '#AA5E79',
      };
      dotSizes = {
        0: 0,
        1: 2,
        10: 5,
        100: 8,
        1000: 11,
        5000: 15,
        10000: 19,
        50000: 23,
        100000: 27,
      };
    }
    // config for choropleth map
    else {
      colors = {
        0: '#FFF',
        1: '#F7F787',
        100: '#EED322',
        500: '#E6B71E',
        1000: '#DA9C20',
        2000: '#CA8323',
        5000: '#B86B25',
        10000: '#A25626',
        50000: '#8B4225',
        100000: '#850001',
      };
    }
    const colorsAsList = Object.entries(colors).map(item => [+item[0], item[1]]).flat();
    const dotSizesAsList = Object.entries(dotSizes).map(item => [+item[0], item[1]]).flat();

    return (
      <div className='map-chart'>
        <ControlPanel
          // showMapStyle={true} // TODO enable when choropleth is fixed
          defaultMapStyle={this.state.selectedLayer}
          onMapStyleChange={layerId => {this.setState({selectedLayer: layerId})}}
          showLegend={this.state.selectedLayer != 'confirmed-dots'}
          colors={colors}
        />
        <ReactMapGL.InteractiveMap
          className='map-chart__mapgl-map'
          mapboxApiAccessToken='pk.eyJ1IjoicmliZXlyZSIsImEiOiJjazhkbmNqMGcwdnphM2RuczBsZzVwYXFhIn0.dB-xnlG7S7WEeMuatMBQkQ' // TODO https://uber.github.io/react-map-gl/docs/get-started/mapbox-tokens
          mapStyle='mapbox://styles/mapbox/streets-v11'
          {...this.state.viewport}
          {...this.state.mapSize} // after viewport to avoid size overwrite
          minZoom={1}
          onViewportChange={(viewport) => {
            this.setState({ viewport });
          }}
          onHover={this._onHover}
          dragRotate={false}
          touchRotate={false}
        >
          {this._renderHoverPopup()}
          <ReactMapGL.Source
            type='geojson'
            data={this.dotsGeoJson}
          >
            <ReactMapGL.Layer
              id='confirmed-dots'
              layout={{visibility: this._is_visible('confirmed-dots')}}
              type='circle'
              paint={{
                'circle-radius': [
                  'interpolate',
                  ['linear'],
                  ['number', ['get', 'confirmed']],
                  ...dotSizesAsList
                ],
                'circle-color': [
                  'interpolate',
                  ['linear'],
                  ['number', ['get', 'confirmed']],
                  ...colorsAsList,
                ],
                'circle-opacity': 0.8,
              }}
            />
          </ReactMapGL.Source>
          <ReactMapGL.Source type='geojson' data={this.choropGeoJson}>
            <ReactMapGL.Layer
              id='confirmed-choropleth'
              layout={{visibility: this._is_visible('confirmed-choropleth')}}
              type='fill'
              beforeId='waterway-label'
              paint={{
                'fill-color': [
                  'interpolate',
                  ['linear'],
                  ['number', ['get', 'confirmed']],
                  ...colorsAsList
                  ],
                'fill-opacity': 0.6
              }}
            />
          </ReactMapGL.Source>
        </ReactMapGL.InteractiveMap>
      </div>
    );
  }
}

WorldMapChart.propTypes = {
  rawData: PropTypes.array, // inherited from GuppyWrapper
};

WorldMapChart.defaultProps = {
  rawData: [],
};

export default WorldMapChart;
