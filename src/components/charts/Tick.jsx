import React from 'react';
import PropTypes from 'prop-types';

/**
 * @typedef {Object} TickProps
 * @property {{ value?: string }} [payload]
 * @property {number} [x]
 * @property {number} [y]
 */

/** @param {TickProps} props */
function Tick({ payload = {}, x = 0, y = 0 }) {
  const [countNumber, countName] = payload.value?.split('#');
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
  payload: PropTypes.shape({ value: PropTypes.string }),
  x: PropTypes.number,
  y: PropTypes.number,
};

export default Tick;
