import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { app, navBar } from '../localconf';
import IconComponent from './Icon';

const Header = styled.header`
  background-color: #3283c8;
  overflow: hidden;
  vertical-align: middle;
  margin: auto;
  width: 1216px;
`;

const TopRight = styled.nav`
  float: right;
  color: white;
  overflow: hidden;
`;

// TODO: due to issue https://github.com/styled-components/styled-components/issues/439,
// bgcolor prop triggers react warning now, need to fix
const TopItem = styled(Link)`
  border-right: 1px solid #9b9b9b;
  &:last-child {
    border-right: 0px;
  }
  height: 40px;
  display: inline-block;
  text-align: center;
`;

const TopA = styled.a`  
  border-right: 1px solid #9b9b9b;
  &:last-child {
    border-right: 0px;
  }
  height: 40px;
  display: inline-block;
  text-align: center;
`;

const TopButton = styled.button`
  border: 0px;
  background-color: #3283c8; 
  color: #ffffff;
  vertical-align: middle;
  margin: auto;
  width: auto;
  padding: 0px 20px;
  display: block;
`;

const TopIconButton = ({ dictIcons, item }) => {
  return (
    <TopButton className="body-typo">
      {item.name}&nbsp;{item.icon ? <IconComponent dictIcons={dictIcons}
                                                   iconName={item.icon}
                                                   height="14px"/> : ''}
    </TopButton>
  )
};

TopIconButton.propTypes = {
  item: PropTypes.shape({name: PropTypes.string, icon: PropTypes.string}).isRequired,
  dictIcons: PropTypes.object.isRequired,
};

/**
 * NavBar renders row of nav-items of form { name, icon, link }
 * @param {navaItems,user,onLogoutClick} params
 */
const TopBar = ({ dictIcons, topItems, user, onLogoutClick }) => {
  console.log(`username: ${user.username}`);
  return (
    <div style={{width: "100%", backgroundColor: "#3283c8"}}>
      <Header>
        <TopRight>
          {
            topItems.map(
              item => {
                return (
                  (item.link.startsWith('http')) ?
                    <TopA key={item.link} to={item.link}>
                      <TopIconButton dictIcons={dictIcons} item={item}/>
                    </TopA> :
                    <TopItem key={item.link} to={item.link}>
                      <TopIconButton dictIcons={dictIcons} item={item}/>
                    </TopItem>
                );
              },
            )
          }
          {
            user.username !== undefined && <TopItem to="#" onClick={onLogoutClick}>
              <TopIconButton dictIcons={dictIcons} item={{ name:user.username, icon:'exit' }} />
            </TopItem>
          }
        </TopRight>
      </Header>
    </div>
  );
};

TopBar.propTypes = {
  topItems: PropTypes.array.isRequired,
  user: PropTypes.shape({ username: PropTypes.string }).isRequired,
  onLogoutClick: PropTypes.func.isRequired,
};

export default TopBar;
