import React from 'react';
import PropTypes from 'prop-types';
import * as ReactMapGL from 'react-map-gl';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import 'mapbox-gl/dist/mapbox-gl.css';

import ControlPanel from '../ControlPanel';
import Popup from '../../components/Popup';
import { numberWithCommas } from '../dataUtils.js';
import countyData from '../data/us_counties';
import './IllinoisMapChart.less';

const monthNames = ['Jan', 'Feb', 'Mar', 'April', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

class CustomizedAxisTick extends React.Component {
  render() {
    const { x, y, payload } = this.props; // eslint-disable-line react/prop-types
    const val = payload.value; // eslint-disable-line react/prop-types
    const formattedDate = `${monthNames[new Date(val).getMonth()]} ${new Date(val).getDate()}`;
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor='end' fill='#666' transform='rotate(-60)'>{formattedDate}</text>
      </g>
    );
  }
}

function addDataToGeoJsonBase(fipsData) {
  // Only select Illinois data.
  // Chicago (17999) is separate from Cook county in `countyData`,
  // not in our data
  const base = {
    ...countyData,
    features: countyData.features.filter(f => f.properties.STATE === 'IL' && f.properties.FIPS !== '17999'),
  };
  const geoJson = {
    ...base,
    features: base.features.map((loc) => {
      const location = loc;
      if (location.properties.FIPS in fipsData) {
        location.properties.confirmed = Number(fipsData[location.properties.FIPS].confirmed);
        location.properties.deaths = Number(fipsData[location.properties.FIPS].deaths);
        const allData = fipsData[location.properties.FIPS].allData;
        location.properties.allData = {
          confirmed: allData.confirmed,
          deaths: allData.deaths,
          date: allData.date,
          testing: allData.testing,
          recovered: allData.recovered,
        };
      } else {
        location.properties.confirmed = 0;
        location.properties.deaths = 0;
        location.properties.allData = {};
      }
      return location;
    }),
  };

  return geoJson;
}

class IllinoisMapChart extends React.Component { // eslint-disable-line react/no-multi-comp
  constructor(props) {
    super(props);
    this.updateDimensions = this.updateDimensions.bind(this);
    this.geoJson = null;
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
      selectedDate: props.rawData && props.rawData[0] ?
        new Date(Math.max.apply(
          null, props.rawData[0].date.map(date => new Date(date)),
        ))
        : null,
      selectedLocation: null,
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.rawData.length !== this.props.rawData.length) {
      this.setState(
        {
          selectedDate: nextProps.rawData && nextProps.rawData[0] ?
            new Date(Math.max.apply(
              null, nextProps.rawData[0].date.map(date => new Date(date)),
            ))
            : null,
        },
      );
    }
  }

  onHover = (event) => {
    let hoverInfo = null;

    if (!event.features) { return; }

    event.features.forEach((feature) => {
      if (feature.layer.id !== 'confirmed-choropleth') {
        return;
      }
      let confirmed = feature.properties.confirmed;
      confirmed = confirmed && confirmed !== 'null' ? confirmed : 0;
      let deaths = feature.properties.deaths;
      deaths = deaths && deaths !== 'null' ? deaths : 0;

      const state = feature.properties.STATE;
      const county = feature.properties.COUNTYNAME;
      let locationName = 'US';
      locationName = (state && state !== 'null' ? `${state}, ` : '') + locationName;
      locationName = (county && county !== 'null' ? `${county}, ` : '') + locationName;
      hoverInfo = {
        lngLat: event.lngLat,
        locationName,
        values: {
          'confirmed cases': numberWithCommas(confirmed),
          deaths: numberWithCommas(deaths),
        },
      };
    });

    this.setState({
      hoverInfo,
    });
  };

  onClick = (event) => {
    if (!event.features) { return; }

    let selectedLocation = null;
    event.features.forEach((feature) => {
      if (feature.layer.id === 'confirmed-choropleth') {
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

  convertRawDataToDict(rawData) {
    const filteredFeatures = {};
    rawData.reduce((res, location) => {
      if (location.project_id !== 'open-JHU') {
        // we are getting _all_ the location data from Guppy because there
        // is no way to filter by project using the GuppyWrapper. So have
        // to filter on client side
        return res;
      }
      if (location.province_state !== 'Illinois') {
        return res;
      }
      const selectedDateIndex = location.date.findIndex(
        x => new Date(x).getTime() === this.state.selectedDate.getTime(),
      );

      res[location.FIPS] = {
        confirmed: location.confirmed[selectedDateIndex],
        deaths: location.deaths[selectedDateIndex],
        allData: { ...location },
      };
      return res;
    }, filteredFeatures);
    return filteredFeatures;
  }

  formatLocationData = (data) => {
    let max = 0;
    let sortedData = data.date.map((date, i) => {
      max = Math.max(max, data.confirmed[i], data.deaths[i]);
      return {
        date,
        confirmed: data.confirmed[i],
        deaths: data.deaths[i],
      };
    });
    sortedData = sortedData.sort((a, b) => new Date(a.date) - new Date(b.date));
    return { data: sortedData, max };
  }

  closePopup = () => {
    this.setState({ selectedLocation: null });
  }

  updateDimensions() {
    this.setState({
      mapSize: { width: '100%', height: window.innerHeight - 221 },
    });
  }

  renderPopup() {
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
          </div>
        </ReactMapGL.Popup>
      );
    }
    return null;
  }

  renderTooltip = (props) => {
    const date = new Date(props.label);
    return (
      <div className='map-chart__tooltip'>
        <p>{monthNames[date.getMonth()]} {date.getDate()}, {date.getFullYear()}</p>
        {
          props.payload.map((data, i) => (
            <p style={{ color: data.stroke }} key={i}>{data.name}: {data.value}</p>
          ))
        }
      </div>
    );
  }

  render() {
    const rawData = this.props.rawData;
    const { selectedLocation } = this.state;

    if (!this.geoJson || this.geoJson.features.length === 0) {
      const fipsData = this.convertRawDataToDict(rawData);
      this.geoJson = addDataToGeoJsonBase(fipsData);
    }

    const colors = {
      0: '#FFF',
      1: '#F7F787',
      20: '#EED322',
      50: '#E6B71E',
      100: '#DA9C20',
      250: '#CA8323',
      500: '#B86B25',
      750: '#A25626',
      1000: '#8B4225',
      2500: '#850001',
    };
    const colorsAsList = Object.entries(colors).map(item => [+item[0], item[1]]).flat();
    const selectedLocationData = selectedLocation ?
      this.formatLocationData(selectedLocation.data) : null;

    return (
      <div className='map-chart'>
        <ControlPanel
          showMapStyle={false}
          showLegend={this.state.selectedLayer !== 'confirmed-choropleth'}
          colors={colors}
        />
        <ReactMapGL.InteractiveMap
          className='.map-chart__mapgl-map'
          mapboxApiAccessToken='pk.eyJ1IjoicmliZXlyZSIsImEiOiJjazhkbmNqMGcwdnphM2RuczBsZzVwYXFhIn0.dB-xnlG7S7WEeMuatMBQkQ' // TODO https://uber.github.io/react-map-gl/docs/get-started/mapbox-tokens
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
          // maxBounds={[ // doesn't work
          //   [-74.04728500751165, 40.68392799015035], // Southwest coordinates
          //   [-73.91058699000139, 40.87764500765852] // Northeast coordinates
          // ]}
        >
          {this.renderPopup()}
          <ReactMapGL.Source type='geojson' data={this.geoJson}>
            <ReactMapGL.Layer
              id='confirmed-choropleth'
              type='fill'
              beforeId='waterway-label'
              paint={{
                'fill-color': [
                  'interpolate',
                  ['linear'],
                  ['number', ['get', 'confirmed']],
                  ...colorsAsList,
                ],
                'fill-opacity': 0.6,
              }}
            />
          </ReactMapGL.Source>
        </ReactMapGL.InteractiveMap>
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
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='date' tick={<CustomizedAxisTick />} interval={1} />
                  <YAxis type='number' domain={[0, selectedLocationData.max || 'auto']} />
                  <Tooltip content={this.renderTooltip} />
                  <Legend />
                  <Line type='monotone' dataKey='deaths' stroke='#aa5e79' />
                  <Line type='monotone' dataKey='confirmed' stroke='#8884d8' activeDot={{ r: 8 }} />
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
