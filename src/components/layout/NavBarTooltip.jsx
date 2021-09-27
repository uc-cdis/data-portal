import React from 'react';
import PropTypes from 'prop-types';
import './NavBarTooltip.css';

/**
 * @typedef {Object} NavBarTooltipProps
 * @property {string} content
 * @property {number} x
 * @property {number} y
 */

/** @param {NavBarTooltipProps} props */
function NavBarTooltip({ content, x, y }) {
  return (
    <div className='navbar-tooltip' style={{ top: y, left: x }}>
      <div className='navbar-tooltip__wrapper'>
        <div className='navbar-tooltip__content'>{content}</div>
        <span className='navbar-tooltip__arrow navbar-tooltip__arrow--outer' />
        <span className='navbar-tooltip__arrow navbar-tooltip__arrow--inner' />
      </div>
    </div>
  );
}

NavBarTooltip.propTypes = {
  content: PropTypes.string.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
};

export default NavBarTooltip;
