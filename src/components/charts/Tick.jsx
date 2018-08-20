import React from 'react';
import PropTypes from 'prop-types';

class Tick extends React.Component {
  render() {
    const { x, y, payload } = this.props;
    const texts = payload.value.split('#');
    return (
      <g>
        <text textAnchor='end' x={x} y={y} dy={0}>
          <tspan className='special-number' fill='#3283C8'>{`${texts[0]} `}</tspan>
          <tspan className='h4-typo'>{`${texts[1]}`}</tspan>
        </text>
      </g>
    );
  }
}

Tick.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  payload: PropTypes.object,
};

Tick.defaultProps = {
  x: 0,
  y: 0,
  payload: {},
};

export default Tick;
