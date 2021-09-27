import React from 'react';
import PropTypes from 'prop-types';
import './Spinner.less';

function Spinner({ text = '', type = 'dots' }) {
  if (type === 'spinning')
    // spinning spinner
    return (
      <div className='spinning-spinner-cell'>
        <div className='wrapper'>
          <div className='spinning-spinner' />
        </div>
      </div>
    );

  // dots
  return (
    <div className='spinner'>
      <svg className='spinner__svg' width='60' height='20' viewBox='0 0 60 20'>
        <circle cx='7' cy='15' r='4' />
        <circle cx='30' cy='15' r='4' />
        <circle cx='53' cy='15' r='4' />
      </svg>
      {text && <div className='spinner__text'> {text} </div>}
    </div>
  );
}

Spinner.propTypes = {
  text: PropTypes.string,
  type: PropTypes.string,
};

export default Spinner;
