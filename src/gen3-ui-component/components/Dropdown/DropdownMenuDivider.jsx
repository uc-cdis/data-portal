import React from 'react';
import PropTypes from 'prop-types';

const DropdownMenuDivider = props => (
  <hr
    className={`g3-dropdown__menu-divider ${props.className || ''}`}
  />
);

DropdownMenuDivider.propTypes = {
  className: PropTypes.string,
};

DropdownMenuDivider.defaultProps = {
  className: '',
};

export default DropdownMenuDivider;
