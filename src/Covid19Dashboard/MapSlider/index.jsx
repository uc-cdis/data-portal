import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './mapSlider.less';

function MapSlider({ value, maxValue, title, onChange }) {
  // const [sliderValue, setSliderValue] = useState(value);

  return (
    <div id='map-slider' className='map-slider top'>
      <div className='map-overlay-inner' id='map-overlay-inner'>
        <h2>{title}</h2>
        <table>
          <tr>
            <td>
              <label className='medium-title' id='map-refrence-tense' />
              <label className='medium-title' id='map-date' />
            </td>
          </tr>
        </table>

        <input id='slider' type='range' min='0' max={maxValue} step='1' value={value} onChange={(e) => { onChange(e.target.value); }} />
      </div>
    </div>
  );
}

export default MapSlider;

