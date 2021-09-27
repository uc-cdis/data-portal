import React from 'react';
import PropTypes from 'prop-types';

function DropdownMenuDivider({ className = '' }) {
  return <hr className={`g3-dropdown__menu-divider ${className}`} />;
}

DropdownMenuDivider.propTypes = {
  className: PropTypes.string,
};

export default DropdownMenuDivider;
