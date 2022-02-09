import React from 'react';
import PropTypes from 'prop-types';
import {
  Tab, Tabs, TabList, TabPanel,
} from 'react-tabs';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import 'react-tabs/style/react-tabs.less';

import {
  covid19DashboardConfig, mapboxAPIToken, auspiceUrlIL,
} from '../localconf';
import Popup from '../components/Popup';
import Spinner from '../components/Spinner';
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
const bayesOutputDir = 'generative_bayes_model';
const dashboardDataLocations = {
  modeledFipsList: `${bayesOutputDir}/CountyCodeList.txt`,
  jhuJsonByDateLatest: 'map_data/jhu_il_json_by_time_latest.json',
  vaccinesByCountyByDate: 'map_data/vaccines_by_county_by_date.json',
  top10ChartData: 'charts_data/top10.txt',
  idphDailyChartData: 'idph_daily.txt',
};

class Covid19Dashboard extends React.Component {
  componentDidMount() {
    if (!mapboxAPIToken) {
      console.warn('MAPBOX_API_TOKEN environment variable not set, will not display maps.'); // eslint-disable-line no-console
    }

    // fetch all data in `dashboardDataLocations`
    Object.entries(dashboardDataLocations).forEach(
      (e) => this.props.fetchDashboardData(e[0], e[1]),
    );
  }

  getTotalCounts() {
    let confirmedCountIL = 0;
    let deathsCountIL = 0;
    let vaccinatedCountIL = 0;

    if (this.props.vaccinesByCountyByDate.total) {
      vaccinatedCountIL = this.props.vaccinesByCountyByDate.total;
    }

    if (this.props.jhuJsonByDateLatest.totals) {
      confirmedCountIL = this.props.jhuJsonByDateLatest.totals.C;
      deathsCountIL = this.props.jhuJsonByDateLatest.totals.D;
    }

    return {
      confirmedCountIL, deathsCountIL, vaccinatedCountIL,
    };
  }

  formatLocationTimeSeriesData = () => {
    const maxes = { C: 0, D: 0 };
    let sortedData = Object.keys(this.props.selectedLocationData.data).map((date) => {
      const values = {};
      ['C', 'D'].forEach((field) => {
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
    const locationPopupData = (this.props.selectedLocationData
      && !this.props.selectedLocationData.loading) ? this.formatLocationTimeSeriesData() : null;
    const timeSeriesChart = locationPopupData
      ? (
        <ResponsiveContainer>
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
              interval={Math.round(locationPopupData.data.length / 50)}
            />
            <YAxis
              label={{ value: 'confirmed', angle: -90, position: 'insideLeft' }}
              yAxisId='left'
              type='number'
              domain={[0, Math.max(Object.values(locationPopupData.maxes)) || 'auto']}
              tickFormatter={(val) => Number(val).toLocaleString()}
              fontSize={10}
            />
            <YAxis
              label={{ value: 'deaths', angle: 90, position: 'insideRight' }}
              yAxisId='right'
              orientation='right'
              type='number'
              domain={[0, Math.max(Object.values(locationPopupData.maxes)) || 'auto']}
              tickFormatter={(val) => Number(val).toLocaleString()}
              fontSize={10}
            />
            <Tooltip content={this.renderLocationPopupTooltip} />
            <Legend />

            <Line
              name='confirmed'
              yAxisId='left'
              type='monotone'
              dataKey='C'
              stroke='#8884d8'
              dot={false}
            />
            <Line
              name='deaths'
              yAxisId='right'
              type='monotone'
              dataKey='D'
              stroke='#aa5e79'
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )
      : <Spinner />;

    const modeledCountyFips = this.props.selectedLocationData
      ? this.props.selectedLocationData.modeledCountyFips : null;

    // no additional charts for this location: do not render a carousel
    if (!modeledCountyFips) {
      return timeSeriesChart;
    }

    const imgProps = {
      imgCases: `${bayesOutputDir}/${modeledCountyFips}/cases.svg`,
      imgRt: `${bayesOutputDir}/${modeledCountyFips}/rt.svg`,
    };
    const imgMetadata = covid19DashboardConfig.chartsConfig.simulations || {};

    let carouselChartsConfig = [
      {
        type: 'component',
        prop: 'timeSeriesChart',
      },
    ];
    carouselChartsConfig = carouselChartsConfig.concat(
      Object.keys(imgProps).map((propName) => ({
        type: 'image',
        prop: propName,
        title: (imgMetadata[propName] && imgMetadata[propName].title) || null,
        description: (imgMetadata[propName] && imgMetadata[propName].description) || null,
      })),
    );

    const popupCarousel = (
      <ChartCarousel
        chartsConfig={carouselChartsConfig}
        isInPopup
        timeSeriesChart={timeSeriesChart}
        {...imgProps}
      />
    );
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
            const val = typeof (rawData[data.dataKey]) === 'number' ? rawData[data.dataKey].toLocaleString() : rawData[data.dataKey];
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
      confirmedCountIL, deathsCountIL, vaccinatedCountIL,
    } = this.getTotalCounts();

    return (
      <div className='covid19-dashboard'>
        {/* dashboard tabs */}
        <div>
          <Tabs>
            <TabList className='covid19-dashboard_tablist'>
              <Tab>COVID-19 in Illinois</Tab>
              <Tab>IL SARS-CoV2 Genomics</Tab>
            </TabList>

            {/* illinois tab */}
            <TabPanel className='covid19-dashboard_panel'>
              <div className='covid19-dashboard_counts'>
                <CountWidget
                  label='Total Confirmed'
                  value={confirmedCountIL}
                />
                <CountWidget
                  label='Total Deaths'
                  value={deathsCountIL}
                />
                <CountWidget
                  label='Total Vaccinated'
                  value={vaccinatedCountIL}
                />
              </div>
              <div className='covid19-dashboard_visualizations'>
                { mapboxAPIToken
                  && (
                    <IllinoisMapChart
                      jsonByDate={this.props.jhuJsonByDateLatest}
                      jsonVaccinated={this.props.vaccinesByCountyByDate}
                      modeledFipsList={this.props.modeledFipsList}
                      fetchTimeSeriesData={this.props.fetchTimeSeriesData}
                    />
                  )}
                {chartsConfig.illinois && chartsConfig.illinois.length > 0
                  && (
                    <div className='covid19-dashboard_charts'>
                      {chartsConfig.illinois.map((carouselConfig, i) => (
                        <ChartCarousel
                          key={i}
                          chartsConfig={carouselConfig}
                          {...this.props}
                          enablePopupOnClick
                        />
                      ),
                      )}
                    </div>
                  )}
              </div>
            </TabPanel>
            <TabPanel className='covid19-dashboard_panel'>
              <div className='covid19-dashboard_auspice'>
                {/* this component doesn't need the mapboxAPIToken but it's a way to make
                sure this is the COVID19 Commons and the iframe contents will load */}
                { mapboxAPIToken
                  && (
                    <iframe
                      title='IL SARS-CoV2 Genomics'
                      frameBorder='0'
                      className='covid19-dashboard_auspice__iframe'
                      src={auspiceUrlIL}
                    />
                  )}
              </div>
            </TabPanel>
          </Tabs>
        </div>

        {/* popup when click on a location */}
        {
          this.props.selectedLocationData
            ? (
              <Popup
                title={this.props.selectedLocationData.title}
                onClose={() => this.props.closeLocationPopup()}
              >
                {this.renderLocationPopupContents()}
              </Popup>
            )
            : null
        }
      </div>
    );
  }
}

class CustomizedXAxisTick extends React.Component {
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
  jhuJsonByDateLatest: PropTypes.object,
  vaccinesByCountyByDate: PropTypes.object,
  selectedLocationData: PropTypes.object,
  closeLocationPopup: PropTypes.func.isRequired,
  top10ChartData: PropTypes.array,
  idphDailyChartData: PropTypes.array,
};

Covid19Dashboard.defaultProps = {
  modeledFipsList: [],
  jhuJsonByDateLatest: { il_county_list: {}, last_updated: '' },
  vaccinesByCountyByDate: { il_county_list: {}, last_updated: '', total: null },
  selectedLocationData: null,
  top10ChartData: [],
  idphDailyChartData: [],
};

export default Covid19Dashboard;
