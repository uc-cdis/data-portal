import React from 'react';
import styled from 'styled-components';
import querystring from 'querystring';
import PropTypes from 'prop-types'; // see https://github.com/facebook/prop-types#prop-types

import { Box } from '../theme';
import { basename, appname } from '../localconf';

const CentralBox = styled(Box)`
  text-align: center;
  margin: 0px;
  position: fixed;
  width: 100%;
  left: 0px;
  padding: 0px;
`;

export const LoginButton = styled.a`
  font-size: 1em;
`;

class Login extends React.Component {
  static propTypes = {
    providers: PropTypes.arrayOf(
      PropTypes.objectOf(PropTypes.any),
    ).isRequired,
    location: PropTypes.object.isRequired,
  };

  render() {
    let next = basename;
    const location = this.props.location; // this is the react-router "location"
    const queryParams = querystring.parse(location.search ? location.search.replace(/^\?+/, '') : '');
    if (queryParams.next) {
      next = basename === '/' ? queryParams.next : basename + queryParams.next;
    }
    const appLines = appname.split('\n');
    return (
      <div>
        <CentralBox>
          <img src={'/src/img/logo.png'} style={{ height: '80px' }} alt={''} />
          {
            appLines.map(
              line => <h3 className="article" key={line}>{line}</h3>,
            )
          }
          {
            this.props.providers.map(
              p => (
                <div key={p.id}>
                  <LoginButton
                    className="btn btn-primary navbar-btn btn-sm login-button"
                    href={`${p.url}?redirect=${window.location.origin}${next}`}
                  >
                    {p.name}
                  </LoginButton>
                </div>
              ),
            )
          }
        </CentralBox>
      </div>
    );
  }
}

export default Login;
