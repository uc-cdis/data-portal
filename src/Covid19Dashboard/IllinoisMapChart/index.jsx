import React from 'react';
import PropTypes from 'prop-types';
import { Range } from 'rc-slider';
import * as ReactMapGL from 'react-map-gl';

import ControlPanel from '../ControlPanel';

import 'mapbox-gl/dist/mapbox-gl.css';
import './IllinoisMapChart.less';

import countyData from '../c_03mr20'

const numberWithCommas = x => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

class IllinoisMapChart extends React.Component {
  constructor(props) {
    super(props);
    this.updateDimensions = this.updateDimensions.bind(this);
    this.geoJson = null;
    this.counties = {
      ...countyData,
      features: countyData.features.filter(f => f.properties.STATE == 'IL' && f.properties.FIPS != '17999')
    };
    this.state = {
      mapSize: {
        width: '100%',
        height: window.innerHeight - 221,
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
      showLegend: true,
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
  }

  // componentWillUnmount() {
  //   window.removeEventListener('resize', this.updateDimensions);
  // }

  updateDimensions() {
    this.setState({ mapSize: { height: window.innerHeight - 221 } });
  }

  _onHover = (event) => {
    let hoverInfo = null;

    if (!event.features) { return; }

    event.features.forEach((feature) => {
      if (feature.layer.id == 'confirmed') {
        const state = feature.properties.STATE;
        const county = feature.properties.COUNTYNAME;
        const cases = feature.properties.confirmed;
        let locationStr = 'US';
        locationStr = (state && state != 'null' ? `${state}, ` : '') + locationStr
        locationStr = (county && county != 'null' ? `${county}, ` : '') + locationStr
        hoverInfo = {
          lngLat: event.lngLat,
          locationName: locationStr,
          confirmed: cases && cases != 'null' ? cases : 0,
        };
      }
    });

    this.setState({
      hoverInfo,
    });
  };

  _renderPopup() {
    const { hoverInfo } = this.state;
    if (hoverInfo) {
      return (
        <ReactMapGL.Popup longitude={hoverInfo.lngLat[0]} latitude={hoverInfo.lngLat[1]} closeButton={false}>
          <div className='location-info'>
            {hoverInfo.locationName}: {numberWithCommas(hoverInfo.confirmed)} cases
          </div>
        </ReactMapGL.Popup>
      );
    }
    return null;
  }

  convertDataToDict(rawData, selectedDate) {
    var filteredFeatures = {};
    rawData.reduce((res, location) => {
      if (location.project_id != 'open-JHU') {
        // we are getting _all_ the location data from Guppy because there
        // is no way to filter by project using the GuppyWrapper. So have
        // to filter on client side
        return res;
      }
      if (location.province_state != "Illinois"){
        return res;
      }
      location.date.forEach((date, i) => {
        if (new Date(date).getTime() != selectedDate.getTime()) {
          return;
        }
        res[location.FIPS] = {
        'confirmed': location.confirmed[i],
        'deaths': location.deaths[i],
        }
      });
      return res;
    }, filteredFeatures);
    return filteredFeatures;
  }

  convertDataToGeoJson(fipsData) {
    const geoJson = {
      ...this.counties,
      features: this.counties.features.map((location) => {
        if (location.properties.FIPS in fipsData) {
          location.properties.confirmed = Number(fipsData[location.properties.FIPS].confirmed);
        } else {
          location.properties.confirmed = 0;
        }
        return location;
      }),
    };

    return geoJson;
  }

  render() {
    const rawData = this.props.rawData;
    // console.log('rawData', rawData);

    if (!this.geoJson || this.geoJson.features.length == 0) {
      // find latest date we have in the data
      let selectedDate = new Date();
      if (rawData.length > 0) {
        selectedDate = new Date(Math.max.apply(null, rawData[0].date.map(date => new Date(date))));
      }
      const fipsData = this.convertDataToDict(rawData, selectedDate);
      this.geoJson =this.convertDataToGeoJson(fipsData);
    }

    const colors = {
      0: '#fff',
      1: '#f7f787',
      20: '#EED322',
      50: '#E6B71E',
      100: '#DA9C20',
      250: '#CA8323',
      500: '#B86B25',
      750: '#A25626',
      1000: '#8B4225',
      2500: '#aa5e79'
    };
    const colorsAsList = Object.entries(colors).map(item => [+item[0], item[1]]).flat();

    return (
      <div className='map-chart'>
        <ReactMapGL.InteractiveMap
          className='map'
          mapboxApiAccessToken='pk.eyJ1IjoicmliZXlyZSIsImEiOiJjazhkbmNqMGcwdnphM2RuczBsZzVwYXFhIn0.dB-xnlG7S7WEeMuatMBQkQ' // TODO https://uber.github.io/react-map-gl/docs/get-started/mapbox-tokens
          mapStyle='mapbox://styles/mapbox/streets-v11'
          {...this.state.viewport}
          {...this.state.mapSize} // after viewport to avoid size overwrite
          onViewportChange={(viewport) => {
            this.setState({ viewport });
          }}
          onHover={this._onHover}
          dragRotate={false}
          touchRotate={false}
          // maxBounds={[ // doesn't work
          //   [-74.04728500751165, 40.68392799015035], // Southwest coordinates
          //   [-73.91058699000139, 40.87764500765852] // Northeast coordinates
          // ]}
        >
          {this._renderPopup()}
          <ReactMapGL.Source type='geojson' data={this.geoJson}>
            <ReactMapGL.Layer
              id='confirmed'
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
        <ControlPanel
          containerComponent={this.props.containerComponent}
          settings={this.state}
          colors={colors}
        />
      </div>
    );
  }
}

IllinoisMapChart.propTypes = {
  rawData: PropTypes.array, // inherited from GuppyWrapper
};

IllinoisMapChart.defaultProps = {
  rawData: [],
};

export default IllinoisMapChart;
