import React from 'react';
import { Box } from '../theme';
import Footer from '../components/Footer.jsx';
import { userapiPath, basename, appname, login } from '../localconf.js';
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
`;
const LoginButton = styled.a`
  box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 10px, rgba(0, 0, 0, 0.23) 0px 3px 10px;
  transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
  border-radius: 0px;
  height: 50px;
  width: 200px;
  line-height: 50px;
  padding: 0px;
  font-size: 1em;
`;
const Login = (props) => {
  let next = basename;
  if (Object.keys(props.location.query).length != 0) {
    next = basename === '/' ? props.location.query.next : basename + props.location.query.next;
  }
  return (
    <div>
      <CentralBox>
        <h3 className="article">{appname}</h3>
        <LoginButton className="btn btn-primary navbar-btn btn-sm login-button" href={login.url + location.origin + next}>{login.title}</LoginButton>
      </CentralBox>
      <Footer />
    </div>
  );
};

export default Login;
