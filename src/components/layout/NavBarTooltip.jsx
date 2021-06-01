import React from 'react';
import PropTypes from 'prop-types';

import './NavBarTooltip.css';

function NavBarTooltip({ content, x, y }) {
  const popupLeft = x;
  const popupTop = y;
  return (
    <div
      className='navbar-tooltip'
      style={{
        top: popupTop,
        left: popupLeft,
      }}
    >
      {
        <div className='navbar-tooltip__wrapper'>
          <div className='navbar-tooltip__content'>{content}</div>
          <span className='navbar-tooltip__arrow navbar-tooltip__arrow--outer' />
          <span className='navbar-tooltip__arrow navbar-tooltip__arrow--inner' />
        </div>
      }
    </div>
  );
}

NavBarTooltip.propTypes = {
  content: PropTypes.string.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
};

export default NavBarTooltip;
