import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { numberWithCommas } from '../../dataUtils.js';

import './LegendPanel.less';

function dictToLegendList(colors) {
  // input: {0: '#FFF', 10: '#888', 100: '#000'}
  // output: [[ '0-9', '#FFF' ], [ '10-99', '#888' ], [ '100+', '#000' ]]
  return Object.entries(colors).map((value, i) => {
    const color = value[1];
    let label = Number(value[0]);
    if (i === Object.keys(colors).length - 1) {
      label = `${label}+`;
    } else {
      const nextLabel = Number(Object.keys(colors)[i + 1]);
      if (nextLabel - 1 !== label) {
        label = `${label} - ${nextLabel - 1}`;
      }
    }
    return [numberWithCommas(label), color];
  });
}

class LegendPanel extends PureComponent {
  render() {
    const legendData = dictToLegendList(this.props.colors);
    return (
      <div className='legend-panel'>
        <h3>Legend</h3>
        <div>
          {
            legendData.map(
              value =>
                (<p
                  key={value[1]}
                  className='legend-panel__item'
                >
                  <span
                    style={{ backgroundColor: value[1] }}
                  />
                  {value[0]}
                </p>),
            )
          }
        </div>
      </div>
    );
  }
}

LegendPanel.propTypes = {
  colors: PropTypes.object,
};

LegendPanel.defaultProps = {
  colors: {},
};

export default LegendPanel;
