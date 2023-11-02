import { useEffect, useState } from 'react';
import PropTypes from 'prop-types'; // see https://github.com/facebook/prop-types#prop-types
import { useLocation } from 'react-router-dom';
import Select, { createFilter } from 'react-select';
import Button from '../gen3-ui-component/components/Button';
import { basename, loginPath } from '../localconf';
import { overrideSelectTheme } from '../utils';
import './Login.css';

/** @typedef {import('./types').LoginData} LoginData */
/** @typedef {import('./types').LoginProvider} LoginProvider */

/**
 * @typedef {Object} LoginProps
 * @property {LoginData} data
 * @property {LoginProvider[]} [providers]
 * @property {string} username
 */

/** @type {LoginProvider[]} */
const defaultProviders = [
  {
    idp: 'google',
    name: 'Google OAuth',
    urls: [
      {
        name: 'Google OAuth',
        url: `${loginPath}google/`,
      },
    ],
  },
];

/** @param {LoginProvider[]} providers */
function getLoginOptions(providers) {
  /** @type {{ [index: number]: { label: string; value: string; }[]}} */
  const loginOptions = {}; // one for each login provider

  providers.forEach((provider, index) => {
    const loginUrls = provider.urls;

    // sort login options by name
    loginUrls.sort((a, b) => {
      if (a.name.trim() > b.name.trim()) return 1;
      if (b.name.trim() > a.name.trim()) return -1;
      return 0;
    });

    // URLs in format expected by Select component
    loginOptions[index] = loginUrls.map(({ url, name }) => ({
      value: url,
      label: name,
    }));
  });

  return loginOptions;
}

/** @param {LoginProps} props */
function Login({ data, providers = defaultProviders, username }) {
  useEffect(() => {
    // WARNING: TEMPORARY WORKAROUND
    // A login issue was reported where attempts to re-login (especially using
    // a different account) after logging out from the portal takes to a fence
    // location, instead of back to the portal homepage.
    // Erasing csrftoken cookie value for unauthenticated visitor seemingly
    // resolvess the issue, but this should not be considered a permandent fix.
    if (username === undefined) {
      console.warn('Clearing csrftoken for an unauthenticated visitor.');
      document.cookie = 'csrftoken=;';
    }
  }, []);

  const location = useLocation();
  /** @type {{ label: string; value: string; }} */
  const emptyOption = undefined;
  const [selectedLoginOption, setSelectedLoginOption] = useState(emptyOption);
  const loginOptions = getLoginOptions(providers);

  /** @param {number} index */
  function handleLogin(index) {
    const providerLoginUrl =
      loginOptions[index].length === 1
        ? loginOptions[index][0].value
        : selectedLoginOption.value;
    const queryChar = providerLoginUrl.includes('?') ? '&' : '?';

    const searchParams = new URLSearchParams(location.search);
    const next = `${basename}${
      searchParams.has('next') ? searchParams.get('next') : ''
    }`.replace(/\/+/g, '/'); // clean up url: no double slashes

    window.location.href = `${providerLoginUrl}${queryChar}redirect=${window.location.origin}${next}`;
  }

  return (
    <div className='login-page'>
      <div className='login-page__spacer' />
      <div className='login-page__central-content'>
        <div className='h1-typo login-page__title'>{data.title}</div>
        <div className='high-light login-page__sub-title'>{data.subTitle}</div>
        <hr className='login-page__separator' />
        <div className='body-typo' style={{ whiteSpace: 'pre-wrap' }}>{data.text}</div>
        {providers.map((provider, index) => (
          <div className='login-page__entries' key={provider.idp}>
            {provider.desc}
            <div className='login-page__entry-login'>
              {
                // if there are multiple URLs, display a dropdown next
                // to the login button
                loginOptions[index].length > 1 && (
                  <Select
                    aria-label='Login options'
                    isClearable
                    isSearchable
                    options={loginOptions[index]}
                    filterOption={createFilter({
                      ignoreAccents: true,
                      ignoreCase: true,
                    })}
                    onChange={setSelectedLoginOption}
                    value={selectedLoginOption}
                    theme={overrideSelectTheme}
                  />
                )
              }
              <Button
                className='login-page__entry-button'
                onClick={() => handleLogin(index)}
                label={provider.name}
                buttonType={provider.secondary ? 'default' : 'primary'}
              />
            </div>
          </div>
        ))}
        <div>
          {data.contact}
          {data.email && !data.contact_link && (
            <a href={`mailto:${data.email}`}>{data.email}</a>
          )}
          {data.contact_link && (
            <a href={data.contact_link.href}>
              {data.contact_link.text
                ? data.contact_link.text
                : data.contact_link.href}
            </a>
          )}
          {'.'}
        </div>
      </div>
      <div className='login-page__side-bars'>
        <div
          className='login-page__side-bar'
          style={{ background: 'var(--pcdc-color__primary-light)' }}
        />
        <div
          className='login-page__side-bar'
          style={{ background: 'var(--pcdc-color__primary-dark)' }}
        />
        <div
          className='login-page__side-bar'
          style={{ background: 'var(--pcdc-color__secondary)' }}
        />
      </div>
    </div>
  );
}

Login.propTypes = {
  data: PropTypes.exact({
    title: PropTypes.string.isRequired,
    subTitle: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    contact_link: PropTypes.exact({
      text: PropTypes.string,
      href: PropTypes.string.isRequired,
    }),
    contact: PropTypes.string, // deprecated; use contact_link
    email: PropTypes.string, // deprecated; use contact_link
  }).isRequired,
  providers: PropTypes.arrayOf(
    PropTypes.exact({
      idp: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      urls: PropTypes.arrayOf(
        PropTypes.exact({
          name: PropTypes.string.isRequired,
          url: PropTypes.string.isRequired,
        }).isRequired
      ).isRequired,
      desc: PropTypes.string,
      secondary: PropTypes.bool,
      id: PropTypes.string, // deprecated; use id
      url: PropTypes.string, // deprecated; use urls
    }).isRequired
  ),
  username: PropTypes.string,
};

export default Login;
