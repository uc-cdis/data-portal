import React from 'react';
import { Box } from '../theme';
import { userapi_path, basename, appname, login } from '../localconf.js';
import { connect } from 'react-redux';
import styled from 'styled-components';

const CentralBox = styled(Box)`
  text-align: center
`
const LoginButton = styled.a`
  font-size: 1em;
`
const Login = (props) => {
  let next = basename;
  if (Object.keys(props.location.query).length != 0){
    next = basename + props.location.query.next;
  }
  return (
  <CentralBox>
    <h3 className='article'>{appname}</h3>
    <LoginButton className="btn btn-primary navbar-btn btn-sm login-button" href={login.url + location.origin + next}>{login.title}</LoginButton>
  </CentralBox>
)
};

export default Login
