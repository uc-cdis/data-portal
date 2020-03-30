import React from 'react';
import PropTypes from 'prop-types';
// import ReactEcharts from 'echarts-for-react';
// import Slider from 'react-slick';
import { Range } from 'rc-slider';
// import { fetchWithCreds } from '../../actions';
// import { colorsForCharts, guppyGraphQLUrl } from '../../localconf';

import 'mapbox-gl/dist/mapbox-gl.css';
import * as ReactMapGL from 'react-map-gl'; // TODO add to package.json
import {json as requestJson} from 'd3-request'; // npm install d3-request

import './MapChart.less';

// require('echarts/map/js/world.js');

// TODO
// how to display when logged out?

class MapChart extends React.Component {
  constructor(props) {
    super(props);
    this.updateDimensions = this.updateDimensions.bind(this);
    this.state = {
      mapSize: {
        width: '100%',
        height: window.innerHeight - 221,
      },
      viewport: {
        latitude: 0,
        longitude: 0,
        zoom: 0,
        bearing: 0,
        pitch: 0
      },
      hoverInfo: null
    };
  }

  componentDidMount() {
    // const typeName = this.props.dataType;
    // const xAxisProp = this.props.xAxisProp;
    // const yAxisProp = this.props.yAxisProp;
    // this.downloadData(typeName, xAxisProp, yAxisProp)
    //   .then(({ datasets, valuesSet }) => {
    //     this.setState({ datasets, valuesSet });
    //   });
    // requestJson(
    //   'https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson',
    //   (error, response) => {
    //     if (!error) {
    //       // Note: In a real application you would do a validation of JSON data before doing anything with it,
    //       // but for demonstration purposes we ingore this part here and just trying to select needed data...
    //       const features = response.features;
    //       const endTime = features[0].properties.time;
    //       const startTime = features[features.length - 1].properties.time;

    //       this.setState({
    //         data: response,
    //         earthquakes: response,
    //         endTime,
    //         startTime,
    //         selectedTime: endTime
    //       });
    //     }
    //   }
    // );
    window.addEventListener('resize', this.updateDimensions);
  }

  // componentWillUnmount() {
  //   window.removeEventListener('resize', this.updateDimensions);
  // }

  updateDimensions() {
    this.setState({ mapSize: { height: window.innerHeight - 221 }});
  }

  // onAfterDateSliderChange(e) {
  //   console.log(e)
  // }

  _onHover = event => {
    let hoverInfo = null;

    if (!event.features)
      return

    event.features.forEach(feature => {
      if (feature.layer.id == 'confirmed') {
        const state = feature.properties.province_state;
        const cases = feature.properties.confirmed
        const locationStr = (state && state != "null" ? state + ", " : "") + feature.properties.country_region
        hoverInfo = {
          lngLat: event.lngLat,
          locationName: locationStr,
          confirmed: cases && cases != "null" ? cases : 0
        };
      }
    });

    this.setState({
      hoverInfo
    });
  };

  _renderPopup() {
    const {hoverInfo} = this.state;
    if (hoverInfo) {
      return (
        <ReactMapGL.Popup longitude={hoverInfo.lngLat[0]} latitude={hoverInfo.lngLat[1]} closeButton={false}>
          <div className="location-info">
            {hoverInfo.locationName}: {hoverInfo.confirmed} cases
            </div>
        </ReactMapGL.Popup>
      );
    }
    return null;
  }

  render() {
    let rawData = this.props.rawData;

    // find latest date we have in the data
    let selectedDate = new Date();
    if (rawData.length > 0) {
      selectedDate = new Date(Math.max.apply(null, rawData[0]['date'].map(function(date) {
        return new Date(date);
      })));
    }

    const colors = {
      0: '#2DC4B2',
      10: '#3BB3C3',
      100: '#669EC4',
      1000: '#8B88B6',
      10000: '#A2719B',
      50000: '#aa5e79',
    };
    const colorsAsList = Object.entries(colors).map(item=>[+item[0], item[1]]).flat();
    // console.log('colorsAsList', colorsAsList)

    // console.log('rawData', rawData);

    let features = rawData.reduce((res, location) => {
      let new_features = [];
      location['date'].forEach((date, i) => {
        if (new Date(date).getTime() != selectedDate.getTime()) {
          return;
        }
  
        // for (const data_type of ['confirmed', 'deaths']){
          const confirmed = location.confirmed[i];
          const deaths = location.deaths[i];
          let feature = {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [location.longitude, location.latitude]
            },
            properties: {
                country_region: location.country_region,
                province_state: location.province_state,
                date: date,
                'marker-symbol': 'monument',
                confirmed: confirmed != null ? (+confirmed) : 0,
                deaths: deaths != null ? (+deaths) : 0,
            }
          };
          // if (val == null)
          //   console.log(location.country_region, location.province_state, date, data_type, val)

          // console.log(feature.properties)
          // feature.properties[data_type] = val != null ? (+val) : 0;
          // console.log(feature.properties)

          // if (val == null)
          //   console.log(feature.properties[data_type])
          new_features.push(feature);
        // }
      });
      // console.log(res.length, new_features.length)
      return res.concat(new_features)
    }, []);

    // console.log('features', features[0])

    let my_geojson = {
      type: 'FeatureCollection',
      features: features
    };

    let maxValue = Math.max.apply(Math, features.map(function(e) { return e.properties.confirmed; }));
    const minDotSize = 2;
    const maxDotSize = 30;

    if (!rawData || rawData.length == 0) {
      features = []
      maxValue = 2
    }

    return (
      <div className='map-chart'>
        <ReactMapGL.InteractiveMap
          className='map'
          // {...this.props.globalStore!.mapViewport}
          {...this.state.viewport}
          {...this.state.mapSize} // must be after viewport so that size is not overwriten
          mapStyle='mapbox://styles/mapbox/light-v10'
          // zoom={this.state.zoom}
          // onViewportChange={(viewport) => this.props.globalStore!.mapViewport = viewport}
          mapboxApiAccessToken='pk.eyJ1IjoicmliZXlyZSIsImEiOiJjazhkbmNqMGcwdnphM2RuczBsZzVwYXFhIn0.dB-xnlG7S7WEeMuatMBQkQ' // TODO https://uber.github.io/react-map-gl/docs/get-started/mapbox-tokens
          // attributionControl={false}
          // dragRotate={false}
          // touchRotate={false}
          // scrollZoom={true}
          // doubleClickZoom={true}
          onViewportChange={(viewport) => {
            // const {width, height, latitude, longitude, zoom} = viewport;
            this.setState({viewport})
          }}
          // dragPan={!this.state.onOverlayLeft}
          // ref={this.props.globalStore!.mapRef}
          onHover={this._onHover}
        >
          {this._renderPopup()}
          <ReactMapGL.Source type='geojson' data={my_geojson}>
            {/* {rawData && */}
              <ReactMapGL.Layer
                id='confirmed'
                type='circle'
                paint={{
                  'circle-radius': [
                    'interpolate',
                    ['linear'],
                    ['number', ['get', 'confirmed']],
                    0, 0,
                    1, minDotSize,
                    maxValue, maxDotSize
                  ],
                  'circle-color': [
                    'interpolate',
                    ['linear'],
                    ['number', ['get', 'confirmed']],
                    ...colorsAsList
                  ],
                  'circle-opacity': 0.8
                }}
                // filter={['==', ['number', ['get', 'date']], 12]}
              />
              {/* <ReactMapGL.Layer
                id='confirmed_fill'
                type='fill'
                paint={{
                  'fill-color': {
                    property: 'percentile',
                    stops: [
                      [0, '#3288bd'],
                      [1, '#66c2a5'],
                      [2, '#abdda4'],
                      [3, '#e6f598'],
                      [4, '#ffffbf'],
                      [5, '#fee08b'],
                      [6, '#fdae61'],
                      [7, '#f46d43'],
                      [8, '#d53e4f']
                    ]
                  },
                  // 'fill-color': [
                  //   'interpolate',
                  //   ['linear'],
                  //   ['number', ['get', 'confirmed']],
                  //   ...colorsAsList
                  // ],
                }}
              /> */}
            {/* } */}
          </ReactMapGL.Source>
          {/* <div className='right-overlays' onMouseEnter={() => this.setState({onOverlay: true})} onMouseLeave={() => this.setState({onOverlay: false})}>
              <SideBar />
          </div> */}
          {/* <div className='left-overlays' onMouseEnter={() => this.setState({onOverlayLeft: true})} onMouseLeave={() => this.setState({onOverlayLeft: false})}>
            <div className='time-select'><TimeSelection /></div>
            <div className='layer-select'>
              <LayerSelection
                layers={naturalLayers}
                title='Disaster Type'
                types={naturalTypes}
              />
            </div>
            <div className='layer-select'>
              <LayerSelection
                layers={humanLayers}
                title='Affected Residents'
                types={['']}
              />
            </div>
          </div> */}
        </ReactMapGL.InteractiveMap>
        {
        false && <div className='console'>
          <h1>COVID-19</h1>
          <div className='session'>
            <h2>Confirmed cases</h2>
            <div className='row colors'>
            </div>
            <div className='row labels'>
              <div className='label'>0</div>
              <div className='label'>10</div>
              <div className='label'>100</div>
              <div className='label'>1000</div>
              <div className='label'>10000</div>
              <div className='label'>50000</div>
            </div>
          </div>
          <div className='session' id='sliderbar'>
            <h2>Date: <label id='active-hour'>12PM</label></h2>
            {/* <Range
              className='g3-range-filter__slider'
              min={1}
              max={4}
              value={[3, 3.5]}
              // onChange={e => this.onSliderChange(e)}
              onAfterChange={() => this.onAfterDateSliderChange()}
              step={0.5}
            /> */}
          </div>
        </div>
        }
            {/* <Range
              className='g3-range-filter__slider'
              min={1}
              max={4}
              value={[3, 3.5]}
              // onChange={e => this.onSliderChange(e)}
              onAfterChange={() => this.onAfterDateSliderChange()}
              step={0.5}
            /> */}
      </div>
    );
  }
}

MapChart.propTypes = {
  rawData: PropTypes.array, // inherited from GuppyWrapper
  // chartTitle: PropTypes.string.isRequired,
  // dataType: PropTypes.string.isRequired,
  // yAxisProp: PropTypes.string.isRequired,
  // xAxisProp: PropTypes.string.isRequired,
  constrains: PropTypes.object,
  logBase: PropTypes.number,
  initialUnselectedKeys: PropTypes.arrayOf(PropTypes.string),
  dataTypePlural: PropTypes.string,
  subTitle: PropTypes.string,
};

MapChart.defaultProps = {
  rawData: [],
  constrains: {},
  logBase: null,
  initialUnselectedKeys: [],
  dataTypePlural: null,
  subTitle: null,
};

export default MapChart;
