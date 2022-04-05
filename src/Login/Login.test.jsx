import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import { components } from '../params';
import Login from './Login';

const testProps = {
  providers: [
    {
      idp: 'shibboleth',
      name: 'NIH Login',
      urls: [
        {
          name: 'NIH Login',
          url: 'https://localhost/user/login/shib',
        },
      ],
    },
    {
      idp: 'google',
      name: 'Google OAuth',
      urls: [
        {
          name: 'Google OAuth',
          url: 'https://localhost/user/login/google',
        },
      ],
    },
  ],
  location: window.location,
  data: components.login,
};

beforeEach(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

test('lists login providers', () => {
  const { container } = render(
    <MemoryRouter>
      <Login {...testProps} />
    </MemoryRouter>
  );
  expect(container.querySelectorAll('.g3-button')).toHaveLength(
    testProps.providers.length
  );
});
