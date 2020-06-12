import React from 'react';
import PropTypes from 'prop-types';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import 'react-tabs/style/react-tabs.less';

import { covid19DashboardConfig, mapboxAPIToken } from '../localconf';
import Popup from '../components/Popup';
import Spinner from '../components/Spinner';
import { numberWithCommas } from './dataUtils.js';
import WorldMapChart from './WorldMapChart';
import IllinoisMapChart from './IllinoisMapChart';
import CountWidget from './CountWidget';
import ChartCarousel from './ChartCarousel';
import './Covid19Dashboard.less';


// |-----------------------------------|
// | Data Commons logo, title, buttons |
// |-----------------------------------|
// | World Tab | IL Tab |              |
// |-----------------------------------|
// |   # of cases   |   # of deaths    |
// |-----------------------------------|
// |                         |  Chart  |
// |                         | Carousel|
// |           Map           |---------|
// |                         |  Chart  |
// |                         | Carousel|
// |-----------------------------------|
//
// Config:
// "covid19DashboardConfig": {
//   "dataUrl": "",
//   "chartsConfig": { <tab ID>: [ <carousel 1 config>, <carousel 2 config> ] }
//       where each carousel config = [ <chart 1 config>, <chart 2 config> ]
//       and each chart configuration = {
//         title (str),
//         description (str, optional),
//         xTitle (str, optional),
//         yTitle (str, optional),
//         type (str): one of [lineChart, image],
//         prop (str): property name for the chart data, as hardcoded below
//       }
// },


/* To fetch new data:
- add the prop name and location to `dashboardDataLocations` or `imageLocations`;
- add the prop to Covid19Dashboard.propTypes;
- add it to ReduxCovid19Dashboard.handleDashboardData();
- add it to covid19DashboardConfig.chartsConfig in the relevant chart's config.
*/
const dashboardDataLocations = {
  jhuGeojsonLatest: 'map_data/jhu_geojson_latest.json',
  jhuJsonByLevelLatest: 'map_data/jhu_json_by_level_latest.json',
  top10ChartData: 'top10.txt',
  seirObservedChartData: 'observed_cases.txt',
  seirSimulatedChartData: 'simulated_cases.txt',
  idphDailyChartData: 'idph_daily.txt',
};
const imageLocations = {
  imgCases: 'charts_data/cases.png',
  imgCasesForecast: 'charts_data/casesForecast.png',
  imgDeaths: 'charts_data/deaths.png',
  imgDeathsForecast: 'charts_data/deathsForecast.png',
  imgRt: 'charts_data/Rt.png',
  imgRtJune1: 'charts_data/Rt_June_1.png',
};

class Covid19Dashboard extends React.Component {
  constructor(props) {
    super(props);
  }

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

  formatSelectedLocationData = () => {
    let max = 0;
    let sortedData = Object.keys(this.props.selectedLocationData.data).map((date) => {
      const confirmed = this.props.selectedLocationData.data[date].confirmed;
      const deaths = this.props.selectedLocationData.data[date].deaths;
      const recovered = this.props.selectedLocationData.data[date].recovered;
      max = Math.max(max, confirmed, deaths, recovered);
      return { date, confirmed, deaths, recovered };
    });
    sortedData = sortedData.sort((a, b) => new Date(a.date) - new Date(b.date));
    return { data: sortedData, max };
  }

  renderLocationPopupTooltip = (props) => {
    const date = new Date(props.label);
    const monthNames = [
      'Jan', 'Feb', 'Mar',
      'April', 'May', 'Jun',
      'Jul', 'Aug', 'Sept',
      'Oct', 'Nov', 'Dec',
    ];
    return (
      <div className='covid19-dashboard__tooltip'>
        <p>{monthNames[date.getMonth()]} {date.getDate()}, {date.getFullYear()}</p>
        {
          props.payload.map((data, i) => (
            <p
              style={{ color: data.stroke }}
              key={i}
            >{data.name}: {numberWithCommas(data.value)}
            </p>
          ))
        }
      </div>
    );
  }

  render() {
    const chartsConfig = covid19DashboardConfig.chartsConfig || {};

    const locationPopupData = (this.props.selectedLocationData &&
      !this.props.selectedLocationData.loading) ? this.formatSelectedLocationData() : null;
    const locationPopupContents = locationPopupData ?
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
            domain={[0, locationPopupData.max || 'auto']}
            tickFormatter={val => numberWithCommas(val)}
          />
          <Tooltip content={this.renderLocationPopupTooltip} />
          <Legend />
          <Line type='monotone' dataKey='confirmed' stroke='#8884d8' activeDot={{ r: 8 }} />
          <Line type='monotone' dataKey='recovered' stroke='#00B957' />
          <Line type='monotone' dataKey='deaths' stroke='#aa5e79' />
        </LineChart>
      </ResponsiveContainer>)
      : <Spinner />;

    const {
      confirmedCount, deathsCount, recoveredCount,
    } = this.getTotalCounts();

    const displaySeirPlot = Object.keys(this.props.seirObservedChartData).length > 0
      && Object.keys(this.props.seirSimulatedChartData).length > 0;
    const seirChartData = displaySeirPlot ? [
      {
        data: this.props.seirObservedChartData,
        name: 'Observed Cases',
      },
      {
        data: this.props.seirSimulatedChartData,
        name: 'Simulated Cases',
      },
    ] : [];

    return (
      <div className='covid19-dashboard'>
        <div>
          <Tabs>
            <TabList className='covid19-dashboard_tablist'>
              <Tab>COVID-19 in Illinois</Tab>
              <Tab>COVID-19 in the world</Tab>
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
                    fetchTimeSeriesData={this.props.fetchTimeSeriesData}
                  />
                }
                {chartsConfig.illinois && chartsConfig.illinois.length > 0 &&
                  <div className='covid19-dashboard_charts'>
                    {chartsConfig.illinois.map((carouselConfig, i) =>
                      (<ChartCarousel
                        key={i}
                        chartsConfig={carouselConfig}
                        seirChartData={seirChartData} // not used for now
                        {...imageLocations}
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
                        {...imageLocations}
                        {...this.props}
                      />),
                    )}
                  </div>
                }
              </div>
            </TabPanel>
          </Tabs>
        </div>
        {
          this.props.selectedLocationData ?
            <Popup
              title={this.props.selectedLocationData.title}
              onClose={() => this.props.closeLocationPopup()}
            >
              {locationPopupContents}
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
    const formattedDate = `${new Date(val).getMonth()}/${new Date(val).getDate()}`;
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor='end'
          fill='#666'
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
  jhuGeojsonLatest: PropTypes.object,
  jhuJsonByLevelLatest: PropTypes.object,
  selectedLocationData: PropTypes.object,
  closeLocationPopup: PropTypes.func.isRequired,
  seirObservedChartData: PropTypes.object,
  seirSimulatedChartData: PropTypes.object,
  top10ChartData: PropTypes.array,
  idphDailyChartData: PropTypes.array,
};

Covid19Dashboard.defaultProps = {
  jhuGeojsonLatest: { type: 'FeatureCollection', features: [] },
  jhuJsonByLevelLatest: { country: {}, state: {}, county: {} },
  selectedLocationData: null,
  seirObservedChartData: {},
  seirSimulatedChartData: {},
  top10ChartData: [],
  idphDailyChartData: [],
};

export default Covid19Dashboard;
