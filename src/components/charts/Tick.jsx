import PropTypes from 'prop-types';
import { Text } from 'recharts';

/**
 * @typedef {Object} TickProps
 * @property {{ value?: string }} [payload]
 * @property {number} [x]
 * @property {number} [y]
 */

/** @param {TickProps} props */
function Tick({ payload = {}, x = 0, y = 0 }) {
  const [countNumber, countName] = payload.value.split('#');
  return (
    <g>
      <text textAnchor='end' x={x} y={y} dy={0}>
        <tspan className='special-number' fill='var(--pcdc-color__primary)'>
          {countNumber}
        </tspan>
      </text>
      <Text
        textAnchor='end'
        x={x}
        y={y}
        dy={10}
        width='200'
        verticalAnchor='start'
        fill={''}
        className='h4-typo'
      >
        {countName}
      </Text>
    </g>
  );
}

Tick.propTypes = {
  payload: PropTypes.shape({ value: PropTypes.string }),
  x: PropTypes.number,
  y: PropTypes.number,
};

export default Tick;
