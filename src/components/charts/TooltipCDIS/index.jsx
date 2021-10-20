import React from 'react';
import PropTypes from 'prop-types';
import './TooltipCDIS.less';

/**
 * @typedef {Object} TooltipCDISProps
 * @property {boolean} [active]
 * @property {string} [label]
 * @property {{ fill: string; name: string; value: number }[]} [payload]
 */

/** @param {TooltipCDISProps} props */
function TooltipCDIS({ active = false, label = '', payload = [] }) {
  if (!active) return null;

  const txts = label.split('#');
  const number = parseInt(txts[0], 10);
  return (
    <div className='cdis-tooltip'>
      <h2>{`${txts[1]}`}</h2>
      {payload.map((item) => (
        <div
          key={item.name}
          style={{ color: `${item.fill}` }}
          className='body-typo'
        >{`${item.name} : ${Math.round((item.value / 100) * number)}`}</div>
      ))}
    </div>
  );
}

TooltipCDIS.propTypes = {
  active: PropTypes.bool,
  label: PropTypes.string,
  payload: PropTypes.arrayOf(
    PropTypes.shape({
      fill: PropTypes.string,
      name: PropTypes.string,
      value: PropTypes.string,
    })
  ),
};

export default TooltipCDIS;
