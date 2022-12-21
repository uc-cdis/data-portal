import React from 'react';
import './SampleComponent.less';
import SampleChart from './SampleChart.svg';

/**
 *  A simple sample component. In this case we are using
 *  a function component. however you can use a class
 *  component as well.
 *  A typical component will have one ot more .jsx files and
 *  an associated .less file for css.
 */

const SampleComponent = () => (
  <div className='card'>
    <h2 className='card-title'>Sample Component</h2>
    <h3 className='card-subtitle'>Card Subtitle</h3>
    <div className='card-chart'>
      <SampleChart />
    </div>
  </div>
);

export default SampleComponent;
