import React from 'react';
import PropTypes from 'prop-types';
import './TopIconButton.less';

const TopIconButton = ({ name, icon, onActiveTab = () => {}, isActive = false }) => (
  <div
    className={isActive ? 'top-icon-button button-top-active body-typo' : 'top-icon-button body-typo'}
    onClick={onActiveTab}
    onKeyDown={onActiveTab}
    role='button'
    tabIndex={0}
  >
    {name}&nbsp;{icon ? <i
      className={`g3-icon g3-icon--${icon} top-icon-button__icon`}
    /> : ''}
  </div>
);

TopIconButton.propTypes = {
  name: PropTypes.string.isRequired,
  icon: PropTypes.string,
  isActive: PropTypes.bool.isRequired,
  onActiveTab: PropTypes.func,
};

TopIconButton.defaultProps = {
  icon: null,
  onActiveTab: () => {},
  isActive: false,
};

export default TopIconButton;
