import React from 'react';
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

const NavComponent = ({user}) => (
    <header>
      <Home className='fui-home' to='/'></Home>
      <nav className='nav'>
        <ul>
            <li className='logo'><a href='/'>{user.username}</a></li>
            <li className='logout'><a href={ userapi_path+'/logout?next='+basename }>
            <span className="fui-exit"></span>
              logout</a></li>
        </ul>
    </nav>
  </header>
)
const mapStateToProps = (state)=> {return {user: state.user}}

const Nav = connect(mapStateToProps)(NavComponent)
export default Nav