import React from 'react';
import PropTypes from 'prop-types';
import './TopIconButton.less';

/**
 * @param {Object} props
 * @param {string} props.name
 * @param {string} [props.icon]
 * @param {boolean} [props.isActive]
 */
function TopIconButton({ name, icon, isActive = false }) {
  return (
    <div
      className={
        'top-icon-button body-typo' + isActive ? ' button-top-active' : ''
      }
    >
      {name}&nbsp;
      {icon && (
        <i className={`g3-icon g3-icon--${icon} top-icon-button__icon`} />
      )}
    </div>
  );
}

TopIconButton.propTypes = {
  name: PropTypes.string.isRequired,
  icon: PropTypes.string,
  isActive: PropTypes.bool,
};

export default TopIconButton;
