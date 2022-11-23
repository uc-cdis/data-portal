import PropTypes from 'prop-types';
import './TooltipCDIS.css';

/**
 * @typedef {Object} TooltipCDISProps
 * @property {boolean} [active]
 * @property {string} [label]
 * @property {{ fill: string; name: string; payload: { allCounts: number[] } }[]} [payload]
 * @property {any} [testProp]
 */

/** @param {TooltipCDISProps} props */
function TooltipCDIS({ active = false, label = '', payload = [] }) {
  if (!active) return null;

  const txts = label.split('#');
  return (
    <div className='cdis-tooltip'>
      <h2>{`${txts[1]}`}</h2>
      {payload.map((item, i) => (
        <div
          key={item.name}
          style={{ color: `${item.fill}` }}
          className='body-typo'
        >{`${item.name} : ${item.payload.allCounts[i]}`}</div>
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
      payload: PropTypes.shape({
        allCounts: PropTypes.arrayOf(PropTypes.number),
      }),
    })
  ),
};

export default TooltipCDIS;
