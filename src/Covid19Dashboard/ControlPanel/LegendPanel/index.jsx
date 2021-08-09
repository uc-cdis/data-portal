import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import './LegendPanel.less';

// keeping this as it was used. could potentially be rewritten for
// multiple legend types but fails to work properly with negative numbers
function dictToLegendList(colors) {
  // input: {0: '#FFF', 10: '#888', 100: '#000'}
  // output: [[ '0-9', '#FFF' ], [ '10-99', '#888' ], [ '100+', '#000' ]]
  return Object.entries(colors).map((value, i) => {
    const color = value[1];
    let label = Number(value[0]);
    if (i === Object.keys(colors).length - 1) {
      label = `${label.toLocaleString()}+`;
    } else {
      const nextLabel = Number(Object.keys(colors)[i + 1]) - 1;
      if (nextLabel !== label) {
        label = `${label.toLocaleString()} - ${nextLabel.toLocaleString()}`;
      }
    }
    return [label, color];
  });
}

class LegendPanel extends PureComponent {
  render() {
    const legendData = this.props.formattedColors.length > 0
      ? this.props.formattedColors : dictToLegendList(this.props.colors);
    return (
      <div className='legend-panel'>
        <h3>Legend</h3>
        <div>
          {
            legendData.map(
              (value) => (
                <p
                  key={value[1]}
                  className='legend-panel__item'
                >
                  <span
                    style={{ backgroundColor: value[1] }}
                  />
                  {value[0]}
                </p>
              ),
            )
          }
        </div>
      </div>
    );
  }
}

LegendPanel.propTypes = {
  colors: PropTypes.object,
  formattedColors: PropTypes.array,
};

LegendPanel.defaultProps = {
  colors: {},
  formattedColors: [],
};

export default LegendPanel;
