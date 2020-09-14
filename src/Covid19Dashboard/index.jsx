import React from 'react';
import PropTypes from 'prop-types';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import 'react-tabs/style/react-tabs.less';

import { covid19DashboardConfig, mapboxAPIToken, auspiceUrl } from '../localconf';
import Popup from '../components/Popup';
import Spinner from '../components/Spinner';
import { numberWithCommas } from './dataUtils.js';
import WorldMapChart from './WorldMapChart';
import IllinoisMapChart from './IllinoisMapChart';
import CountWidget from './CountWidget';
import ChartCarousel from './ChartCarousel';
import './Covid19Dashboard.less';


/* To fetch new data:
- add the prop name and location to `dashboardDataLocations`;
- add the prop to Covid19Dashboard.propTypes;
- add it to ReduxCovid19Dashboard.handleDashboardData();
- add it to covid19DashboardConfig.chartsConfig in the relevant chart's config.
*/
const dashboardDataLocations = {
  modeledFipsList: 'bayes-by-county/CountyCodeList.txt',
  jhuGeojsonLatest: 'map_data/jhu_geojson_latest.json',
  jhuJsonByLevelLatest: 'map_data/jhu_json_by_level_latest.json',
  top10ChartData: 'top10.txt',
  idphDailyChartData: 'idph_daily.txt',
};

class Covid19Dashboard extends React.Component {
  componentDidMount() {
    if (!mapboxAPIToken) {
      console.warn('MAPBOX_API_TOKEN environment variable not set, will not display maps.'); // eslint-disable-line no-console
    }

    // fetch all data in `dashboardDataLocations`
    Object.entries(dashboardDataLocations).forEach(
      e => this.props.fetchDashboardData(e[0], e[1]),
    );
  }

  getTotalCounts() {
    // find latest date we have in the data
    const confirmedCount = {
      global: 0,
      illinois: 0,
    };
    const deathsCount = {
      global: 0,
      illinois: 0,
    };
    const recoveredCount = {
      global: 0,
      illinois: 0,
    };

    this.props.jhuGeojsonLatest.features.forEach((feat) => {
      const confirmed = +feat.properties.confirmed;
      const deaths = +feat.properties.deaths;
      const recovered = +feat.properties.recovered;
      if (confirmed) {
        confirmedCount.global += confirmed;
        if (feat.properties.province_state === 'Illinois') {
          confirmedCount.illinois += confirmed;
        }
      }
      if (deaths) {
        deathsCount.global += deaths;
        if (feat.properties.province_state === 'Illinois') {
          deathsCount.illinois += deaths;
        }
      }
      if (recovered) {
        recoveredCount.global += recovered;
        if (feat.properties.province_state === 'Illinois') {
          recoveredCount.illinois += recovered;
        }
      }
    });

    return { confirmedCount, deathsCount, recoveredCount };
  }

  formatLocationTimeSeriesData = () => {
    const maxes = { confirmed: 0, deaths: 0, recovered: 0 };
    let sortedData = Object.keys(this.props.selectedLocationData.data).map((date) => {
      const values = {};
      ['confirmed', 'deaths', 'recovered'].forEach((field) => {
        let val = this.props.selectedLocationData.data[date][field];
        if (typeof val !== 'number') val = 0; // '<5' -> 0
        maxes[field] = Math.max(maxes[field], val);
        values[field] = val;
      });
      return { date, ...values };
    });
    sortedData = sortedData.sort((a, b) => new Date(a.date) - new Date(b.date));
    return { data: sortedData, maxes };
  }

  renderLocationPopupContents = () => {
    const locationPopupData = (this.props.selectedLocationData &&
      !this.props.selectedLocationData.loading) ? this.formatLocationTimeSeriesData() : null;
    const timeSeriesChart = locationPopupData ?
      (<ResponsiveContainer>
        <LineChart
          data={locationPopupData.data}
          margin={{
            top: 5, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis
            dataKey='date'
            tick={<CustomizedXAxisTick />}
            interval={1}
          />
          <YAxis
            type='number'
            domain={[0, Math.max(Object.values(locationPopupData.maxes)) || 'auto']}
            tickFormatter={val => numberWithCommas(val)}
            fontSize={10}
          />
          <Tooltip content={this.renderLocationPopupTooltip} />
          <Legend />

          <Line type='monotone' dataKey='confirmed' stroke='#8884d8' dot={false} />
          { locationPopupData.maxes.recovered &&
            <Line type='monotone' dataKey='recovered' stroke='#00B957' dot={false} />
          }
          <Line type='monotone' dataKey='deaths' stroke='#aa5e79' dot={false} />
        </LineChart>
      </ResponsiveContainer>)
      : <Spinner />;

    const modeledCountyFips = this.props.selectedLocationData ?
      this.props.selectedLocationData.modeledCountyFips : null;

    // no additional charts for this location: do not render a carousel
    if (!modeledCountyFips) {
      return timeSeriesChart;
    }

    const imgProps = {
      imgCases: `bayes-by-county/${modeledCountyFips}/cases.png`,
      imgDeaths: `bayes-by-county/${modeledCountyFips}/deaths.png`,
      imgRt: `bayes-by-county/${modeledCountyFips}/Rt.png`,
    };
    const imgMetadata = covid19DashboardConfig.chartsConfig.simulations || {};

    let carouselChartsConfig = [
      {
        type: 'component',
        prop: 'timeSeriesChart',
      },
    ];
    carouselChartsConfig = carouselChartsConfig.concat(
      Object.keys(imgProps).map(propName => ({
        type: 'image',
        prop: propName,
        title: (imgMetadata[propName] && imgMetadata[propName].title) || null,
        description: (imgMetadata[propName] && imgMetadata[propName].description) || null,
      })),
    );

    const popupCarousel = (<ChartCarousel
      chartsConfig={carouselChartsConfig}
      isInPopup
      timeSeriesChart={timeSeriesChart}
      {...imgProps}
    />);
    return popupCarousel;
  }

  renderLocationPopupTooltip = (props) => {
    // we use the raw `selectedLocationData` values instead of the values in
    // `props` because the data is tranformed in `formatLocationTimeSeriesData`
    // to replace strings with zeros, but we want the tooltip to show the
    // original string value.
    const rawDate = props.label;
    const rawData = this.props.selectedLocationData.data[rawDate];
    const date = new Date(rawDate);
    const monthNames = [
      'Jan', 'Feb', 'Mar',
      'April', 'May', 'Jun',
      'Jul', 'Aug', 'Sept',
      'Oct', 'Nov', 'Dec',
    ];
    return (
      <div className='covid19-dashboard__tooltip'>
        <p>{monthNames[date.getUTCMonth()]} {date.getUTCDate()}, {date.getUTCFullYear()}</p>
        {
          props.payload.map((data, i) => {
            const val = typeof (rawData[data.name]) === 'number' ? numberWithCommas(rawData[data.name]) : rawData[data.name];
            return (
              <p
                style={{ color: data.stroke }}
                key={i}
              >
                {data.name}: {val}
              </p>
            );
          })
        }
      </div>
    );
  }

  render() {
    const chartsConfig = covid19DashboardConfig.chartsConfig || {};

    const {
      confirmedCount, deathsCount, recoveredCount,
    } = this.getTotalCounts();

    return (
      <div className='covid19-dashboard'>
        {/* dashboard tabs */}
        <div>
          <Tabs>
            <TabList className='covid19-dashboard_tablist'>
              <Tab>COVID-19 in Illinois</Tab>
              <Tab>COVID-19 in the world</Tab>
              <Tab>SARS-CoV-2 Genomics</Tab>
            </TabList>

            {/* illinois tab */}
            <TabPanel className='covid19-dashboard_panel'>
              <div className='covid19-dashboard_counts'>
                <CountWidget
                  label='Total Confirmed'
                  value={confirmedCount.illinois}
                />
                <CountWidget
                  label='Total Deaths'
                  value={deathsCount.illinois}
                />
              </div>
              <div className='covid19-dashboard_visualizations'>
                { mapboxAPIToken &&
                  <IllinoisMapChart
                    jsonByLevel={this.props.jhuJsonByLevelLatest}
                    modeledFipsList={this.props.modeledFipsList}
                    fetchTimeSeriesData={this.props.fetchTimeSeriesData}
                  />
                }
                {chartsConfig.illinois && chartsConfig.illinois.length > 0 &&
                  <div className='covid19-dashboard_charts'>
                    {chartsConfig.illinois.map((carouselConfig, i) =>
                      (<ChartCarousel
                        key={i}
                        chartsConfig={carouselConfig}
                        {...this.props}
                      />),
                    )}
                  </div>
                }
              </div>
            </TabPanel>

            {/* world tab */}
            <TabPanel className='covid19-dashboard_panel'>
              <div className='covid19-dashboard_counts'>
                <CountWidget
                  label='Total Confirmed'
                  value={confirmedCount.global}
                />
                <CountWidget
                  label='Total Deaths'
                  value={deathsCount.global}
                />
                <CountWidget
                  label='Total Recovered'
                  value={recoveredCount.global}
                />
              </div>
              <div className='covid19-dashboard_visualizations'>
                { mapboxAPIToken &&
                  <WorldMapChart
                    geoJson={this.props.jhuGeojsonLatest}
                    jsonByLevel={this.props.jhuJsonByLevelLatest}
                    fetchTimeSeriesData={this.props.fetchTimeSeriesData}
                  />
                }
                {chartsConfig.world && chartsConfig.world.length > 0 &&
                  <div className='covid19-dashboard_charts'>
                    {chartsConfig.world.map((carouselConfig, i) =>
                      (<ChartCarousel
                        key={i}
                        chartsConfig={carouselConfig}
                        {...this.props}
                      />),
                    )}
                  </div>
                }
              </div>
            </TabPanel>
            <TabPanel className='covid19-dashboard_panel'>
              <div className='covid19-dashboard_auspice'>
                {/* this component doesn't need the mapboxAPIToken but it's a way to make
                sure this is the COVID19 Commons and the iframe contents will load */}
                { mapboxAPIToken &&
                  <iframe
                    title='Auspice'
                    frameBorder='0'
                    className='covid19-dashboard_auspice__iframe'
                    src={auspiceUrl}
                  />
                }
              </div>
            </TabPanel>
          </Tabs>
        </div>

        {/* popup when click on a location */}
        {
          this.props.selectedLocationData ?
            <Popup
              title={this.props.selectedLocationData.title}
              onClose={() => this.props.closeLocationPopup()}
            >
              {this.renderLocationPopupContents()}
            </Popup>
            : null
        }
      </div>
    );
  }
}

class CustomizedXAxisTick extends React.Component { // eslint-disable-line react/no-multi-comp
  render() {
    const { x, y, payload } = this.props; // eslint-disable-line react/prop-types
    const val = payload.value; // eslint-disable-line react/prop-types
    const formattedDate = `${new Date(val).getUTCMonth() + 1}/${new Date(val).getUTCDate()}`;
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor='end'
          fill='#666'
          fontSize={10}
          transform='rotate(-60)'
        >
          {formattedDate}
        </text>
      </g>
    );
  }
}

Covid19Dashboard.propTypes = {
  fetchDashboardData: PropTypes.func.isRequired,
  fetchTimeSeriesData: PropTypes.func.isRequired,
  modeledFipsList: PropTypes.array,
  jhuGeojsonLatest: PropTypes.object,
  jhuJsonByLevelLatest: PropTypes.object,
  selectedLocationData: PropTypes.object,
  closeLocationPopup: PropTypes.func.isRequired,
  top10ChartData: PropTypes.array,
  idphDailyChartData: PropTypes.array,
};

Covid19Dashboard.defaultProps = {
  modeledFipsList: [],
  jhuGeojsonLatest: { type: 'FeatureCollection', features: [] },
  jhuJsonByLevelLatest: { country: {}, state: {}, county: {} },
  selectedLocationData: null,
  top10ChartData: [],
  idphDailyChartData: [],
};

export default Covid19Dashboard;
