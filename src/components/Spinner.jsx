import React from 'react';
import './Spinner.less';

class Spinner extends React.Component {
  render() {
    return (
      <div className='spinner'>
        <svg className='spinner__svg' width='60' height='20' viewBox='0 0 60 20'>
          <circle cx='7' cy='15' r='4' />
          <circle cx='30' cy='15' r='4' />
          <circle cx='53' cy='15' r='4' />
        </svg>
      </div>
    );
  }
}

export default Spinner;
