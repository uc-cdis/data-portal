import React from 'react';
import PropTypes from 'prop-types';
// import ReactEcharts from 'echarts-for-react';
// import Slider from 'react-slick';
import { Range } from 'rc-slider';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

// import { fetchWithCreds } from '../actions';
// import { colorsForCharts, guppyGraphQLUrl } from '../localconf';

import WorldMapChart from './WorldMapChart';
import IllinoisMapChart from './IllinoisMapChart';

import 'react-tabs/style/react-tabs.less';
import './Covid19Dashboard.less';

class Covid19Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div className='covid19-dashboard'>
        {/* <ReactEcharts
          option={this.getOption()}
          style={{height: '500px', width: '100%'}}
        /> */}
        <div className='covid19-dashboard_tabs'>
          <Tabs>
            <TabList>
              <Tab>COVID-19 in the world</Tab>
              <Tab>COVID-19 in Illinois</Tab>
            </TabList>

            <TabPanel
              // forceRender={true} // render the tab even when not active
            >
              <WorldMapChart {...this.props} />
            </TabPanel>

            <TabPanel
              // forceRender={true}
            >
              <IllinoisMapChart {...this.props} />
            </TabPanel>
          </Tabs>
        </div>
      </div>
    );
  }
}

Covid19Dashboard.propTypes = {
  // downloadRawData: PropTypes.func, // inherited from GuppyWrapper
};

Covid19Dashboard.defaultProps = {
  // downloadRawData: () => {},
};

export default Covid19Dashboard;
