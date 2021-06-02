import React, {useState} from 'react';
import PropTypes from 'prop-types';

import './mapSlider.less';

function MapSlider ({value, title}) {

    const [sliderValue, setSliderValue] = useState(value);

    return (
        <div id="map-slider" class="map-slider top">
            <div class="map-overlay-inner" id="map-overlay-inner">
                <h2>{title}</h2> 
                <table>
                    <tr>
                        <td>
                            <label class="medium-title" id="map-refrence-tense"></label>
                            <label class="medium-title" id="map-date"></label>
                        </td>
                    </tr>
                </table>
                
                <input id="slider" type="range" min="0" max="88" step="1" value={sliderValue} onChange={(e) => {setSliderValue(e.target.value)}}/>
            </div>
        </div>
    );
  }


export default MapSlider;


