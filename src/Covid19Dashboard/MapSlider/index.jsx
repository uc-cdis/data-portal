import React from 'react';
import PropTypes from 'prop-types';

import './mapSlider.less';

function MapSlider({
  value, maxValue, title, onChange,
}) {
  // const [sliderValue, setSliderValue] = useState(value);

  return (
    <div id='map-slider' className='map-slider top'>
      <div className='map-overlay-inner' id='map-overlay-inner'>
        <h2>{title}</h2>
        <input id='slider' type='range' min='0' max={maxValue} step='1' value={value} onChange={(e) => { onChange(Number(e.target.value)); }} />
      </div>
    </div>
  );
}

MapSlider.propTypes = {
  value: PropTypes.number.isRequired,
  maxValue: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default MapSlider;
