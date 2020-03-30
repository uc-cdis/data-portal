import React from 'react';
import PropTypes from 'prop-types';
import ReactEcharts from 'echarts-for-react';
// import Slider from 'react-slick';
import { Range } from 'rc-slider';
import { fetchWithCreds } from '../actions';
import { colorsForCharts, guppyGraphQLUrl } from '../localconf';

import MapChart from './MapChart';

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
        <MapChart {...this.props} />
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
