import React from 'react';
import PropTypes from 'prop-types';
import IconComponent from '../Icon';
import './TopIconButton.less';

const TopIconButton = ({ dictIcons, item, onActiveTab = () => {}, isActive = false }) => (
  <div
    className={isActive ? 'top-icon-button button-top-active body-typo' : 'top-icon-button body-typo'}
    onClick={onActiveTab}
    onKeyDown={onActiveTab}
    role="button"
    tabIndex={0}
  >
    {item.name}&nbsp;{item.icon ? <IconComponent
      dictIcons={dictIcons}
      iconName={item.icon}
      height="14px"
    /> : ''}
  </div>
);

TopIconButton.propTypes = {
  item: PropTypes.object.isRequired,
  dictIcons: PropTypes.object.isRequired,
  isActive: PropTypes.bool.isRequired,
  onActiveTab: PropTypes.func,
};

TopIconButton.defaultProps = {
  onActiveTab: () => {},
  isActive: false,
};

export default TopIconButton;
