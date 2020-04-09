import React from 'react';
import PropTypes from 'prop-types';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import WorldMapChart from './WorldMapChart';
import IllinoisMapChart from './IllinoisMapChart';
import CountWidget from './CountWidget';
import PlotChart from './PlotChart';
import { formatSeirData } from './dataUtils.js';

import 'react-tabs/style/react-tabs.less';
import './Covid19Dashboard.less';


// |-----------------------------------|
// | Data Commons logo, title, buttons |
// |-----------------------------------|
// | World Tab | IL Tab |              |
// |-----------------------------------|
// |   # of cases   |   # of deaths    |
// |-----------------------------------|
// |                         |  Chart  |
// |                         |         |
// |           Map           |---------|
// |                         |  Chart  |
// |                         |         |
// |-----------------------------------|


const chartDataLocations = {
  seirObserved: 'observed_cases.txt',
  seirSimulated: 'simulated_cases.txt',
}

class Covid19Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    Object.entries(chartDataLocations).forEach(
      (e) => this.props.fetchChartData(e[0], e[1])
    );
  }

  get_total_counts(){
    // find latest date we have in the data
    let selectedDate = new Date();
    if (this.props.rawData.length > 0) {
      selectedDate = new Date(Math.max.apply(null, this.props.rawData[0].date.map(date => new Date(date))));
    }
    let confirmed_count = {
      global: 0,
      illinois: 0
    };
    let deaths_count = {
      global: 0,
      illinois: 0
    };
    let recovered_count = {
      global: 0,
      illinois: 0
    };
    this.props.rawData.forEach(location => {
      if (location.project_id != 'open-JHU') {
        // we are getting _all_ the location data from Guppy because there
        // is no way to filter by project using the GuppyWrapper. So have
        // to filter on client side
        return;
      }
      location.date.forEach((date, i) => {
        if (new Date(date).getTime() != selectedDate.getTime()) {
          return;
        }
        const confirmed = +location.confirmed[i];
        const deaths = +location.deaths[i];
        const recovered = +location.recovered[i];
        const testing = +location.testing[i];
        if (confirmed) {
          confirmed_count['global'] += confirmed;
          if (location.province_state == "Illinois"){
            confirmed_count['illinois'] += confirmed;
          }
        }
        if (deaths) {
          deaths_count['global'] += deaths;
          if (location.province_state == "Illinois"){
            deaths_count['illinois'] += deaths;
          }
        }
        if (recovered) {
          recovered_count['global'] += recovered;
          if (location.province_state == "Illinois"){
            recovered_count['illinois'] += recovered;
          }
        }
      });
    });
    return { confirmed_count, deaths_count, recovered_count };
  }

  render() {
    const { confirmed_count, deaths_count, recovered_count } = this.get_total_counts();

    return (
      <div className='covid19-dashboard'>
        {/* <ReactEcharts
          option={this.getOption()}
          style={{height: '500px', width: '100%'}}
        /> */}
        <div>
          <Tabs>
            <TabList className='covid19-dashboard_tablist'>
              <Tab>COVID-19 in the world</Tab>
              <Tab>COVID-19 in Illinois</Tab>
            </TabList>

            <TabPanel className='covid19-dashboard_panel'>
              <div className='covid19-dashboard_counts'>
                <CountWidget
                  label='Total Confirmed'
                  value={confirmed_count['global']}
                />
                <CountWidget
                  label='Total Deaths'
                  value={deaths_count['global']}
                />
                <CountWidget
                  label='Total Recovered'
                  value={recovered_count['global']}
                />
              </div>
              <div className='covid19-dashboard_visualizations'>
                <WorldMapChart {...this.props} />
                <div className='covid19-dashboard_charts'>
                  <PlotChart />
                  <PlotChart />
                </div>
              </div>
            </TabPanel>

            <TabPanel className='covid19-dashboard_panel'>
              <div className='covid19-dashboard_counts'>
                <CountWidget
                  label='Total Confirmed'
                  value={confirmed_count['illinois']}
                />
                <CountWidget
                  label='Total Deaths'
                  value={deaths_count['illinois']}
                />
              </div>
              <div className='covid19-dashboard_visualizations'>
                <IllinoisMapChart {...this.props} />
                <div className='covid19-dashboard_charts'>
                  <PlotChart />
                  <PlotChart />
                  <PlotChart />
                </div>
              </div>
            </TabPanel>
          </Tabs>
        </div>
      </div>
    );
  }
}

Covid19Dashboard.propTypes = {
  rawData: PropTypes.array, // inherited from GuppyWrapper
  /* To fetch new data:
  - add the prop name and location to `chartDataLocations`;
  - add the prop to ReduxCovid19Dashboard.mapStateToProps;
  - add the prop below.
  */
  fetchChartData: PropTypes.func.isRequired,
  seirObserved: PropTypes.object,
  seirSimulated: PropTypes.object,
};

Covid19Dashboard.defaultProps = {
  rawData: [],
  seirObserved: {},
  seirSimulated: {},
};

export default Covid19Dashboard;
