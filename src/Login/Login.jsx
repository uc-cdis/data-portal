import React from 'react';
import PropTypes from 'prop-types'; // see https://github.com/facebook/prop-types#prop-types
import Select, { createFilter } from 'react-select';
import Button from '../gen3-ui-component/components/Button';
import { basename, loginPath } from '../localconf';
import { overrideSelectTheme } from '../utils';

import './Login.less';

const getInitialState = (height) => ({ height });

const getLoginUrl = (providerLoginUrl, next) => {
  const queryChar = providerLoginUrl.includes('?') ? '&' : '?';
  return `${providerLoginUrl}${queryChar}redirect=${window.location.origin}${next}`;
};

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.resetState = this.resetState.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);
    this.state = {
      height: window.innerHeight - 221,
      selectedLoginOption: {}, // one for each login dropdown
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  selectChange = (selectedOption, index) => {
    this.setState((prevState) => ({
      selectedLoginOption: {
        ...prevState.selectedLoginOption,
        [index]: selectedOption,
      },
    }));
  };

  resetState() {
    this.setState((prevState) => getInitialState(prevState.height));
  }

  updateDimensions() {
    this.setState({ height: window.innerHeight - 221 });
  }

  render() {
    const { location } = this.props; // this is the react-router "location"

    const searchParams = new URLSearchParams(location.search);
    // eslint-disable-next-line no-nested-ternary
    const next = (searchParams.has('next')
      ? basename + searchParams.get('next')
      : location.from
      ? `${basename}${location.from}`
      : basename
    ).replace(/\/+/g, '/'); // clean up url: no double slashes

    const loginOptions = {}; // one for each login provider
    this.props.providers.forEach((provider, i) => {
      // for backwards compatibility, if "urls" does not exist
      // (fence < 4.8.0), generate it from the deprecated "url" field
      let loginUrls = provider.urls;
      if (typeof loginUrls === 'undefined') {
        loginUrls = [
          {
            name: provider.name,
            url: provider.url,
          },
        ];
      }
      // sort login options by name
      loginUrls = loginUrls.sort((a, b) => {
        if (a.name.trim() > b.name.trim()) {
          return 1;
        }
        if (b.name.trim() > a.name.trim()) {
          return -1;
        }
        return 0;
      });
      // URLs in format expected by Select component
      loginOptions[i] = loginUrls.map((e) => ({
        value: e.url,
        label: e.name,
      }));
    });

    return (
      <div className='login-page'>
        <div className='login-page__spacer' />
        <div className='login-page__central-content'>
          <div className='h1-typo login-page__title'>
            {this.props.data.title}
          </div>
          <div className='high-light login-page__sub-title'>
            {this.props.data.subTitle}
          </div>
          <hr className='login-page__separator' />
          <div className='body-typo'>{this.props.data.text}</div>
          {this.props.providers.map((p, i) => (
            <React.Fragment key={i}>
              <div className='login-page__entries'>
                {p.desc}
                <div className='login-page__entry-login'>
                  {
                    // if there are multiple URLs, display a dropdown next
                    // to the login button
                    loginOptions[i].length > 1 && (
                      <Select
                        isClearable
                        isSearchable
                        options={loginOptions[i]}
                        filterOption={createFilter({
                          ignoreAccents: true,
                          ignoreCase: true,
                        })}
                        onChange={(option) => this.selectChange(option, i)}
                        value={
                          this.state.selectedLoginOption &&
                          this.state.selectedLoginOption[i]
                        }
                        theme={overrideSelectTheme}
                      />
                    )
                  }
                  <Button
                    className='login-page__entry-button'
                    onClick={() => {
                      window.location.href = getLoginUrl(
                        loginOptions[i].length > 1
                          ? this.state.selectedLoginOption[i].value
                          : loginOptions[i][0].value,
                        next
                      );
                    }}
                    label={p.name}
                    buttonType={p.secondary ? 'default' : 'primary'}
                  />
                </div>
              </div>
            </React.Fragment>
          ))}
          <div>
            {this.props.data.contact}
            {this.props.data.email && !this.props.data.contact_link && (
              <a href={`mailto:${this.props.data.email}`}>
                {this.props.data.email}
              </a>
            )}
            {this.props.data.contact_link && (
              <a href={this.props.data.contact_link.href}>
                {this.props.data.contact_link.text
                  ? this.props.data.contact_link.text
                  : this.props.data.contact_link.href}
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
}

Login.propTypes = {
  providers: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
  location: PropTypes.object.isRequired,
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    subTitle: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    contact: PropTypes.shape.isRequired,
    email: PropTypes.string, // deprecated; use contact_link instead
    contact_link: PropTypes.shape({
      text: PropTypes.string,
      href: PropTypes.string.isRequired,
    }),
  }).isRequired,
};

Login.defaultProps = {
  providers: [
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
  ],
};

export default Login;
