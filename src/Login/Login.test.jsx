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
        idp: 'shibboleth',
        name: 'NIH Login',
        urls: [{
          name: 'NIH Login',
          url: 'https://localhost/user/login/shib',
        }],
      },
      {
        idp: 'google',
        name: 'Google OAuth',
        urls: [{
          name: 'Google OAuth',
          url: 'https://localhost/user/login/google',
        }],
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
    expect($vdom.find('.g3-button')).toHaveLength(testProps.providers.length);
  });
});
