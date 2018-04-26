import React from 'react';
import styled from 'styled-components';
import IconComponent from '../Icon';
import PropTypes from 'prop-types';

const TopButton = styled.div`
  background-color: #3283c8;
  &:hover {
    border-bottom: 1px solid #ffffff;
  }
  color: #ffffff;
  margin: auto 20px;
  width: auto;
  display: block;
`;

const TopIconButton = ({ dictIcons, item, onActiveTab = () => {}, isActive = false }) => (
  <TopButton
    className={isActive ? 'body-typo button-top-active' : 'body-typo'}
    onClick={onActiveTab}
  >
    {item.name}&nbsp;{item.icon ? <IconComponent
      dictIcons={dictIcons}
      iconName={item.icon}
      height="14px"
    /> : ''}
  </TopButton>
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
