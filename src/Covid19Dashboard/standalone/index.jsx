import React from 'react';
import ReactDOM from 'react-dom';
import IllinoisMapChart from '../IllinoisMapChart';
import './standalone.less';
import { mapboxAPIToken } from '../../localconf';
import countyCodes from './data/CountyCodeList.json';

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
