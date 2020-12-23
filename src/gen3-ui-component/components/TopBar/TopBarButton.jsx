import React from 'react';
import PropTypes from 'prop-types';
import './TopBarButton.css';

const TopBarButton = ({
  item, onActiveTab = () => {}, isActive = false, tabIndex,
}) => (
  <div
    className={isActive ? 'top-bar-button top-bar-button--active body' : 'top-bar-button body'}
    onClick={onActiveTab}
    onKeyDown={onActiveTab}
    role='button'
    tabIndex={tabIndex}
  >
    {item.name}
    {
      item.iconClassName
        ? <i className={`top-bar-button__icon ${item.iconClassName}`} />
        : null
    }
  </div>
);

TopBarButton.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string.isRequired,
    iconClassName: PropTypes.string,
  }).isRequired,
  isActive: PropTypes.bool,
  onActiveTab: PropTypes.func,
  tabIndex: PropTypes.number.isRequired,
};

TopBarButton.defaultProps = {
  onActiveTab: () => {},
  isActive: false,
};

export default TopBarButton;
