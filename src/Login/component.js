import React from 'react';
import { Box } from '../theme';
import Footer from '../Footer/component'
import { userapi_path, basename, appname, login } from '../localconf.js';
import { connect } from 'react-redux';
import styled from 'styled-components';

const CentralBox = styled(Box)`
  text-align: center;
  margin: 0px;
  position: fixed;
  top: 30%;
  width: 100%;
  left: 0px;
  padding: 0px;
`
const LoginButton = styled.a`
  box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px;
  border-radius: 50%;
  height: 200px;
  width: 200px;
  line-height: 200px;
  padding: 0px;
  font-size: 1em;
`
const Login = (props) => {
  let next = basename;
  if (Object.keys(props.location.query).length != 0){
    next = basename === '/' ? props.location.query.next : basename + props.location.query.next;
  }
  return (
  <CentralBox>
    <h3 className='article'>{appname}</h3>
    <LoginButton className="btn btn-primary navbar-btn btn-sm login-button" href={login.url + location.origin + next}>{login.title}</LoginButton>
    <Footer />
  </CentralBox>
)
};

export default Login
