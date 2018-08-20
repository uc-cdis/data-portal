import React from 'react';
import { mount } from 'enzyme';
import { StaticRouter } from 'react-router-dom';

import dictIcons from '../img/icons/sliding';
import { components } from '../params';
import Login from './Login';

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
    dictIcons,
    data: components.login,
  };

  it('lists login providers', () => {
    const $vdom = mount(
      <StaticRouter location={{ pathname: '/login' }} context={{}}>
        <Login
          {...testProps}
        />
      </StaticRouter>,
    );
    expect($vdom.find('.login-page__entries')).toHaveLength(testProps.providers.length);
  });
});
