import React from 'react';
import styled from 'styled-components';

import { Box } from '../theme';
import Footer from '../components/Footer';
import { basename, appname, login } from '../localconf';

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
  font-size: 1em;
`;
const Login = (props) => {
  let next = basename;
  if (Object.keys(props.location.query).length !== 0) {
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
