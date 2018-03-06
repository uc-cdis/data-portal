import React from 'react';
import { mount } from 'enzyme';
import { StaticRouter } from 'react-router-dom';

import Login, { LoginButton } from './Login';

describe('the Login component', () => {
  const testProps = {
    providers: [
      {
        id: 'shibboleth',
        name: 'NIH Login',
        url: 'https://localhost/user/login/shib',
      },
      {
        id: 'google',
        name: 'Google OAuth',
        url: 'https://localhost/user/login/google',
      },
    ],
    location: window.location,
  };

  it('lists login providers', () => {
    const $vdom = mount(
      <StaticRouter location={{ pathname: '/login' }}>
        <Login
          {...testProps}
        />
      </StaticRouter>,
    );
    expect($vdom.find(LoginButton)).toHaveLength(testProps.providers.length);
  });
});
