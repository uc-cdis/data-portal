import React from 'react';
import styled from 'styled-components';
import querystring from 'querystring';

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
  const location = props.location; // this is the react-router "location"
  const queryParams = querystring.parse(location.search ? location.search.replace(/^\?+/, '') : '');
  if (queryParams.next) {
    next = basename === '/' ? queryParams.next : basename + queryParams.next;
  }
  return (
    <div>
      <CentralBox>
        <h3 className="article">{appname}</h3>
        <LoginButton className="btn btn-primary navbar-btn btn-sm login-button" href={login.url + window.location.origin + next}>{login.title}</LoginButton>
      </CentralBox>
      <Footer />
    </div>
  );
};

export default Login;
