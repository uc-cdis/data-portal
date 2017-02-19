import React from 'react';
import { logoutAPI } from './actions';
import { connect } from 'react-redux';
import {basename, userapi_path} from '../localconf.js';
import { Link } from 'react-router';
import styled from 'styled-components';

const Home = styled(Link)`
  position: absolute;
  padding: 10px 20px;
  top: 0px;
  left: 100px;
  background: gray;
  &:hover,
  &:focus,
  &:active {
    background: ${props => props.theme.mid_gray};
    color: white;
  }
`

const NavComponent = ({user, onLogoutClick}) => (
    <header>
      <Home className='fui-home' to='/'></Home>
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