import React from 'react';
import PropTypes from 'prop-types';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.less';

import { mapboxAPIToken } from '../localconf';
import WorldMapChart from './WorldMapChart';
import IllinoisMapChart from './IllinoisMapChart';
import CountWidget from './CountWidget';
// import PlotChart from './PlotChart';
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


// TODO handle both fetch from URL and local files
/* To fetch new data:
- add the prop name and location to `chartDataLocations`;
- add the prop to Covid19Dashboard.propTypes;
- add it to ReduxCovid19Dashboard.handleChartData().
*/
const chartDataLocations = {
  seirObserved: 'observed_cases.txt',
  seirSimulated: 'simulated_cases.txt',
};

class Covid19Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    if (!mapboxAPIToken) {
      console.warn('MAPBOX_API_TOKEN environment variable not set, will be unable to load maps.');
    }

    Object.entries(chartDataLocations).forEach(
      e => this.props.fetchChartData(e[0], e[1]),
    );
  }

  getTotalCounts() {
    // find latest date we have in the data
    let selectedDate = new Date();
    if (this.props.rawData.length > 0) {
      selectedDate = new Date(Math.max.apply(
        null, this.props.rawData[0].date.map(date => new Date(date)),
      ));
    }
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
    this.props.rawData.forEach((location) => {
      if (location.project_id !== 'open-JHU') {
        // we are getting _all_ the location data from Guppy because there
        // is no way to filter by project using the GuppyWrapper. So have
        // to filter on client side
        return;
      }
      location.date.forEach((date, i) => {
        if (new Date(date).getTime() !== selectedDate.getTime()) {
          return;
        }
        const confirmed = +location.confirmed[i];
        const deaths = +location.deaths[i];
        const recovered = +location.recovered[i];
        // const testing = +location.testing[i];
        if (confirmed) {
          confirmedCount.global += confirmed;
          if (location.province_state === 'Illinois') {
            confirmedCount.illinois += confirmed;
          }
        }
        if (deaths) {
          deathsCount.global += deaths;
          if (location.province_state === 'Illinois') {
            deathsCount.illinois += deaths;
          }
        }
        if (recovered) {
          recoveredCount.global += recovered;
          if (location.province_state === 'Illinois') {
            recoveredCount.illinois += recovered;
          }
        }
      });
    });
    return { confirmedCount, deathsCount, recoveredCount };
  }

  render() {
    const { confirmedCount, deathsCount, recoveredCount } = this.getTotalCounts();

    // const displaySeirPlot = Object.keys(this.props.seirObserved).length > 0
    //   && Object.keys(this.props.seirSimulated).length;
    // const seirChart = displaySeirPlot ? (<PlotChart
    //   title='SEIR Model'
    //   xTitle='Date'
    //   yTitle='Population Fraction'
    //   plots={[
    //     {
    //       data: this.props.seirObserved,
    //       name: 'Observed Cases',
    //     },
    //     {
    //       data: this.props.seirSimulated,
    //       name: 'Simulated Cases',
    //     },
    //   ]}
    // />) : null;

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
                <WorldMapChart {...this.props} />
                <div className='covid19-dashboard_charts'>
                  {/* {seirChart} */}
                  <div /> {/* TODO remove. just need to take some space */}
                </div>
              </div>
            </TabPanel>

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
                <IllinoisMapChart {...this.props} />
                <div className='covid19-dashboard_charts'>
                  {/* {seirChart} */}
                  <div /> {/* TODO remove. just need to take some space */}
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
