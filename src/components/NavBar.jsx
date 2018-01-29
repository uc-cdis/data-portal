import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';


const NavLeft = styled.nav`
  top: 0px;
  float: left;
  padding-left: 220px;
`;

const Header = styled.header`
  background-image: url(/src/img/ndh-header.png);
  background-size: 200px 40px;
  background-position: 100px 10px;
  background-repeat: no-repeat; 
  width: 100%;
  background-color: white;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.25);
  padding: 10px 100px;
  overflow: hidden;
`;

const NavRight = styled.nav`
  float: right;
  color: white;
`;

// TODO: due to issue https://github.com/styled-components/styled-components/issues/439,
// bgcolor prop triggers react warning now, need to fix
const NavItem = styled(Link)`
  margin-right: 20px;
  span {
    padding-left: 4px !important;
  }
  height: 100%;
`;

const NavIcon = styled.div`
  vertical-align: middle;
  padding-left: 16px;
`;

/**
 * NavBar renders row of nav-items of form { name, icon, link }
 * @param {navaItems,user,onLogoutClick} params
 */
const NavBar = ({ navItems, user, onLogoutClick }) => (
  <Header>
    <NavLeft>
      {
        navItems.map(
          (item, i) => (
            (item.link.startsWith('http')) ?
              <a key={i} href={item.link}>
                <FlatButton label={item.name}>
                  <NavIcon className="material-icons">{item.icon}</NavIcon>
                </FlatButton>
              </a> :
            <NavItem key={i} to={item.link}>
              <FlatButton label={item.name}>
                <NavIcon className="material-icons">{item.icon}</NavIcon>
              </FlatButton>
            </NavItem>
          ),
        )
      }
    </NavLeft>
    <NavRight>
      { user.username !== undefined &&
        <ul>
          <NavItem to="/"><FlatButton label={user.username} /></NavItem>
          <NavItem to="#" onClick={onLogoutClick}>
            <FlatButton><span className="fui-exit" /></FlatButton>
          </NavItem>
        </ul>
      }
    </NavRight>
  </Header>
);

NavBar.propTypes = {
  navItems: PropTypes.array.isRequired,
  user: PropTypes.shape({ username: PropTypes.string }).isRequired,
  onLogoutClick: PropTypes.func.isRequired,
};

export default NavBar;
