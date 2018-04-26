import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import IconComponent from '../Icon';

const NavDiv = styled.div`
  padding: 16px 0px;
  height: 80px;
  width: 110px;
  display: inline-block;
  text-align: center;
  opacity: 0.8;
  &:hover {
    opacity: 1;
    border-bottom: 3px solid #ef8523;
  }
`;


const NavIcon = styled.div`
  vertical-align: middle;
  padding-left: 4px;
`;

const NavButton = ({ dictIcons, item, onActiveTab, isActive }) => (
  <NavDiv
    className={isActive ? 'body-typo button-active' : 'body-typo'}
    onClick={onActiveTab}
  >
    <NavIcon>
      <IconComponent iconName={item.icon} dictIcons={dictIcons} />
    </NavIcon>
    {item.name}
  </NavDiv>
);


NavButton.propTypes = {
  item: PropTypes.object.isRequired,
  dictIcons: PropTypes.object.isRequired,
  isActive: PropTypes.bool.isRequired,
  onActiveTab: PropTypes.func.isRequired,
};

export default NavButton;
