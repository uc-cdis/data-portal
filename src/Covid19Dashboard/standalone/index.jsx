import React from 'react';
import ReactDOM from 'react-dom';
import IllinoisMapChart from '../IllinoisMapChart';
import './standalone.less';
import { mapboxAPIToken } from '../../localconf';
import countyCodes from './data/CountyCodeList.json';
import jhuJsonByLevelLatest from './data/jhu_json_by_level_2021-05-24.json';

const fetchTimeSeriesData = () => {
};

class Example extends React.Component {
  render() {
    return (
      <div className='covid19-dashboard'>
        <div className='covid19-dashboard_panel'>
          <div className='covid19-dashboard_visualizations'>
            {mapboxAPIToken
            && (
              <IllinoisMapChart
                jsonByLevel={jhuJsonByLevelLatest}
                modeledFipsList={countyCodes.codes}
                fetchTimeSeriesData={fetchTimeSeriesData}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Example />, document.getElementById('root'));
