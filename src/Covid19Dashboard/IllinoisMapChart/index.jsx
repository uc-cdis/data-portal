import React from 'react';
import PropTypes from 'prop-types';
import { Range } from 'rc-slider';
import * as ReactMapGL from 'react-map-gl';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

import ControlPanel from '../ControlPanel';
import Popup from '../../components/Popup';

import 'mapbox-gl/dist/mapbox-gl.css';
import './IllinoisMapChart.less';


import countyData from '../c_03mr20'

const numberWithCommas = x => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const monthNames = ["Jan", "Feb", "Mar", "April", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov","Dec"];

class CustomizedAxisTick extends React.Component {
  render() {
    const {
      x, y, stroke, payload,
    } = this.props;
    const formattedDate = `${monthNames[new Date(payload.value).getMonth()]} ${new Date(payload.value).getDate()}`;
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-60)">{formattedDate}</text>
      </g>
    );
  }
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
      selectedDate: props.rawData && props.rawData[0] ? new Date(Math.max.apply(null, props.rawData[0].date.map(date => new Date(date)))) : null,
      selectedLocation: null,
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

  convertDataToDict(rawData) {
    var filteredFeatures = {};
    rawData.reduce((res, location) => {
      if (location.project_id != 'open-JHU') {
        // we are getting _all_ the location data from Guppy because there
        // is no way to filter by project using the GuppyWrapper. So have
        // to filter on client side
        return res;
      }
      if (location.province_state != "Illinois") {
        return res;
      }
      const selectedDateIndex = location.date.findIndex(x => new Date(x).getTime() === this.state.selectedDate.getTime());

      res[location.FIPS] = {
        confirmed: location.confirmed[selectedDateIndex],
        deaths: location.deaths[selectedDateIndex],
        allData: { ...location },
      }
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
          const allData = fipsData[location.properties.FIPS].allData;
          location.properties.allData = {
            confirmed: allData.confirmed,
            deaths: allData.deaths,
            date: allData.date,
            testing: allData.testing,
            recovered: allData.recovered,
          }
        } else {
          location.properties.confirmed = 0;
          location.properties.allData = {};
        }
        return location;
      }),
    };

    return geoJson;
  }

  _onClick = (event) => {
    if (!event.features) { return; }

    let selectedLocation = null;
    event.features.forEach((feature) => {
      if (feature.layer.id == 'confirmed') {
        const state = feature.properties.STATE;
        const county = feature.properties.COUNTYNAME;
        const fips = feature.properties.FIPS;
        const data = JSON.parse(feature.properties.allData);
        selectedLocation = {
          state,
          county,
          fips,
          data,
        };
      }
    });

    this.setState({ selectedLocation });
  }

  formatLocationData = data => {
    let sortedData = data.date.sort((a, b) => new Date(a) - new Date(b));
    let max = 0;
    sortedData = sortedData.map((date, i) => {
      max = Math.max(max, data.confirmed[i], data.deaths[i]);
      return {
        date,
        confirmed: data.confirmed[i],
        deaths: data.deaths[i],
      }
    });
    return { data: sortedData, max };
  }

  closePopup = () => {
    this.setState({ selectedLocation: null });
  }

  renderTooltip = props => {
    const date = new Date(props.label);
    return (
      <div className='map-chart__tooltip'>
        <p>{monthNames[date.getMonth()]} {date.getDate()}, {date.getFullYear()}</p>
        {
          props.payload.map((data, i) => (
            <p style={{color: data.stroke}} key={i}>{data.name}: {data.value}</p>
          ))
        }
      </div>
    )
  }

  render() {
    const rawData = this.props.rawData;
    const { selectedLocation } = this.state;

    if (!this.geoJson || this.geoJson.features.length == 0) {
      const fipsData = this.convertDataToDict(rawData);
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
    const selectedLocationData = selectedLocation ? this.formatLocationData(selectedLocation.data) : null;
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
          onClick={this._onClick}
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
        {
          this.state.selectedLocation ?
            <Popup
              title={`${selectedLocation.county} County, ${selectedLocation.state}`}
              onClose={() => this.closePopup()}
            >
                <ResponsiveContainer>
                  <LineChart
                    data={selectedLocationData.data}
                    margin={{
                      top: 5, right: 30, left: 20, bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={<CustomizedAxisTick />} interval={1} />
                    <YAxis type="number" domain={[0, selectedLocationData.max || 'auto']} />
                    <Tooltip content={this.renderTooltip} />
                    <Legend />
                    <Line type="monotone" dataKey="confirmed" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="deaths" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
            </Popup>
          : null
        }
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
