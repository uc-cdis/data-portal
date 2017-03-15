import React from 'react';
import { logoutAPI } from './actions';
import { connect } from 'react-redux';
import {basename, userapi_path} from '../localconf.js';
import { Link } from 'react-router';
import styled from 'styled-components';
import { cube } from '../theme.js';

const NavLeft = styled.nav`
  top: 0px;
  left: 100px;
  position: absolute;
`

const NavRight = styled.nav`
  position: absolute;
  right: 100px;
  top: 0;
  color: white;
`
const Home = styled(Link)`
  background: gray;
  &:hover,
  &:focus,
  &:active {
    background: ${props => props.theme.mid_gray};
  }
  ${cube};
`
const Search = styled(Link)`
  background: #daa520;
  &:hover,
  &:focus,
  &:active {
    background: #e8b534;
  }
  ${cube};
`

const Logo = styled(Link)`
  background: ${props => props.theme.color_primary};
  float: left;
  &:hover,
  &:focus,
  &:active {
    background: #ad1a1a;
  }

  ${cube};
`

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
`

const NavComponent = ({user, onLogoutClick}) => (
    <header>
      <NavLeft>
        <Home className='fui-home' to='/'></Home>
        <Search className='fui-search' to='/graphql'></Search>
      </NavLeft>
      <NavRight>
        <ul>
          <Logo to='/'><span>{user.username}</span></Logo>
            <Logout to='#' onClick={onLogoutClick}>
              <span  className='fui-exit'></span><span>Logout</span>
            </Logout>
        </ul>
    </NavRight>
  </header>
)
const mapStateToProps = (state)=> {return {user: state.user}}

const mapDispatchToProps = (dispatch) => ({
  onLogoutClick: ()=> dispatch(logoutAPI())
})
const Nav = connect(mapStateToProps, mapDispatchToProps)(NavComponent)
export default Nav