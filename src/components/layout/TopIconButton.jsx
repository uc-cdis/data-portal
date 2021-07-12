import React from 'react';
import PropTypes from 'prop-types';
import './TopIconButton.less';

const TopIconButton = ({
  name, icon, onActiveTab = () => {}, isActive = false, tabIndex = '0',
}) => (
  <div
    className={isActive ? 'top-icon-button button-top-active body-typo' : 'top-icon-button body-typo'}
    onClick={onActiveTab}
    onKeyDown={onActiveTab}
    role='button'
    tabIndex={tabIndex}
  >
    {name}&nbsp;{icon ? (
      <i
        className={`g3-icon g3-icon--${icon} top-icon-button__icon`}
      />
    ) : ''}
  </div>
);

TopIconButton.propTypes = {
  name: PropTypes.string.isRequired,
  icon: PropTypes.string,
  isActive: PropTypes.bool,
  onActiveTab: PropTypes.func,
  tabIndex: PropTypes.string,
};

TopIconButton.defaultProps = {
  icon: null,
  onActiveTab: () => {},
  isActive: false,
  tabIndex: 0,
};

export default TopIconButton;
