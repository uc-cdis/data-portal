import React from 'react';
import { lighten } from 'polished';
import { logoutAPI } from '../actions';
import { connect } from 'react-redux';
import { basename, userapi_path, nav_items } from '../localconf.js';
import { Link } from 'react-router';
import { NavLink } from 'react-router-dom'
import styled from 'styled-components';
import { cube } from '../theme.js';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import FlatButton from 'material-ui/FlatButton';

const NavLeft = styled.nav`
  top: 0px;
  float: left;
`;

const Header = styled.header`
  width: 100%;
  // background-color: #dfdfdf;
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
const NavItem = styled(NavLink)`
  margin-right: 20px;
  span {
    vertical-align: middle;
    padding-right: 5px;
    padding-left: 0px !important;
  }
  button {
    // color: white !important;
  }
  height: 100%;
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
        {nav_items.map((item, i) => <NavItem key={i} to={item.link}><FlatButton primary={i==0} label={item.name}><NavIcon className="material-icons">{item.icon}</NavIcon> </FlatButton></NavItem>)}
      </NavLeft>
      <NavRight>
        { user.username !== undefined &&
        <ul>
          <NavItem to='/'><FlatButton label={user.username}></FlatButton></NavItem>
          <NavItem to='#' onClick={onLogoutClick}>
              <FlatButton><span  className='fui-exit'></span></FlatButton>
          </NavItem>
        </ul>
        }
    </NavRight>
  </Header>
);
const mapStateToProps = (state)=> {return {user: state.user}};

const mapDispatchToProps = (dispatch) => ({
  onLogoutClick: ()=> dispatch(logoutAPI())
});
const Nav = connect(mapStateToProps, mapDispatchToProps)(NavComponent);
export default Nav
