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

const NavComponent = ({user, onLogoutClick}) => (
    <header>
      <NavLeft>
        <Home className='fui-home' to='/'></Home>
        <Search className='fui-search' to='/graphql'></Search>
      </NavLeft>
      <nav className='nav'>
        <ul>
            <li className='logo'><a href='/'>{user.username}</a></li>
            <li className='logout'><a href='#' onClick={onLogoutClick}>
            <span className="fui-exit"></span>
              logout</a></li>
        </ul>
    </nav>
  </header>
)
const mapStateToProps = (state)=> {return {user: state.user}}

const mapDispatchToProps = (dispatch) => ({
  onLogoutClick: ()=> dispatch(logoutAPI())
})
const Nav = connect(mapStateToProps, mapDispatchToProps)(NavComponent)
export default Nav