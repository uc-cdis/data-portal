import React from 'react';
import PropTypes from 'prop-types';

function Tick({ x = 0, y = 0, payload = {} }) {
  const [countNumber, countName] = payload.value.split('#');
  return (
    <g>
      <text textAnchor='end' x={x} y={y} dy={0}>
        <tspan className='special-number' fill='var(--pcdc-color__primary)'>
          {countNumber}
        </tspan>
      </text>
      <text textAnchor='end' x={x} y={y} dy={20}>
        <tspan className='h4-typo'>{countName}</tspan>
      </text>
    </g>
  );
}

Tick.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  payload: PropTypes.object,
};

export default Tick;
