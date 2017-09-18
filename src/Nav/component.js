import React from 'react';
import { lighten } from 'polished';
import { logoutAPI } from '../actions';
import { connect } from 'react-redux';
import { basename, userapiPath, navItems } from '../localconf.js';
import { Link } from 'react-router';
import styled from 'styled-components';
import { cube } from '../theme.js';

const NavLeft = styled.nav`
  top: 0px;
  left: 100px;
  position: absolute;
`;

const NavRight = styled.nav`
  position: absolute;
  right: 100px;
  top: 0;
  color: white;
`;

// TODO: due to issue https://github.com/styled-components/styled-components/issues/439,
// bgcolor prop triggers react warning now, need to fix
const NavItem = styled(Link)`
  margin-right: 20px;
  span {
    vertical-align: middle;
    padding-right: 5px;
    padding-left: 0px !important;
  }
  button {
    // color: white !important;
  }
  ${cube};
`;
const Logo = styled(Link)`
  background: ${props => props.theme.color_primary};
  float: left;
  &:hover,
  &:focus,
  &:active {
    background: #ad1a1a;
  }

  ${cube};
`;

const Logout = styled(Link)`
  background: ${props => props.theme.mid_light_gray};
  &:hover,
  &:focus,
  &:active {
    background: #cecece;
  }


  float: left;
  span {
    vertical-align: middle;
  }
  ${cube};
`;

const NavIcon = styled.div`
  vertical-align: middle;
  padding-left: 16px;
`;

const NavComponent = ({user, onLogoutClick, classes}) => (
    <Header>
      <NavLeft>
        {navItems.map((item, i) => <NavItem key={i} to={item.link}><FlatButton primary={i==0} label={item.name}><NavIcon className="material-icons">{item.icon}</NavIcon> </FlatButton></NavItem>)}
      </NavLeft>
      <NavRight>
        { user.username !== undefined &&
        <ul>
          <Logo to='/'><span>{user.username}</span></Logo>
            <Logout to='#' onClick={onLogoutClick}>
              <span  className='fui-exit'></span><span>Logout</span>
            </Logout>
        </ul>
        }
    </NavRight>
  </header>
);
const mapStateToProps = (state)=> {return {user: state.user}};

const mapDispatchToProps = (dispatch) => ({
  onLogoutClick: ()=> dispatch(logoutAPI())
});
const Nav = connect(mapStateToProps, mapDispatchToProps)(NavComponent);
export default Nav
