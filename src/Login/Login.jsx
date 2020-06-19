import React from 'react';
import querystring from 'querystring';
import PropTypes from 'prop-types'; // see https://github.com/facebook/prop-types#prop-types
import Select from 'react-select';
import createFilterOptions from 'react-select-fast-filter-options';
import Button from '@gen3/ui-component/dist/components/Button';
import { basename } from '../localconf';
import { components } from '../params';

import './Login.less';

const getInitialState = height => ({ height });

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

  updateDimensions() {
    this.setState({ height: window.innerHeight - 221 });
  }

  resetState() {
    this.setState(getInitialState());
  }

  selectChange = (selectedOption, index) => {
    const selectedLoginOptionCopy = { ...this.state.selectedLoginOption };
    selectedLoginOptionCopy[index] = selectedOption;
    this.setState({
      selectedLoginOption: selectedLoginOptionCopy,
    });
  }

  render() {
    const location = this.props.location; // this is the react-router "location"
    // compose next according to location.from
    let next = (location.from) ? `${basename}${location.from}` : basename;
    // clean up url: no double slashes
    next = next.replace(/\/+/g, '/');
    const queryParams = querystring.parse(location.search ? location.search.replace(/^\?+/, '') : '');
    if (queryParams.next) {
      next = basename === '/' ? queryParams.next : basename + queryParams.next;
    }
    const customImage = components.login && components.login.image ?
      components.login.image
      : 'gene';
    const customImageStyle = { backgroundImage: `url(/src/img/icons/${customImage}.svg)` };

    let loginComponent = (
      <React.Fragment key='login-component'>
        <div className='login-page__entries'>
          <div className='login-page__entry-login'>
            <Button
              className='login-page__entry-button'
              onClick={() => {}}
              buttonType='primary'
              isPending
              enabled={false}
              tooltipEnabled
              tooltipText='Getting available login options... If this button has been loading for a while, please try to refresh this page or contact support'
            />
          </div>
        </div>
      </React.Fragment>
    );

    if (this.props.providers.length > 0) {
      const loginOptions = {}; // one for each login provider
      const filterOptions = {};
      this.props.providers.forEach((provider, i) => {
      // for backwards compatibility, if "urls" does not exist
      // (fence < 4.8.0), generate it from the deprecated "url" field
        let loginUrls = provider.urls;
        if (typeof loginUrls === 'undefined') {
          loginUrls = [{
            name: provider.name,
            url: provider.url,
          }];
        }
        // sort login options by name
        loginUrls = loginUrls.sort(
          (a, b) => {
            if (a.name.trim() > b.name.trim()) {
              return 1;
            }
            if (b.name.trim() > a.name.trim()) {
              return -1;
            }
            return 0;
          });
        // URLs in format expected by Select component
        loginOptions[i] = loginUrls.map(e => ({
          value: e.url,
          label: e.name,
        }));
        // this is needed when the list of options is very long,
        // to avoid too much lag time when users type
        filterOptions[i] = createFilterOptions({
          options: loginOptions[i],
        });
      });

      loginComponent = this.props.providers.map(
        (p, i) => (
          <React.Fragment key={i}>
            <div className='login-page__entries'>
              { p.desc }
              <div className='login-page__entry-login'>
                {
                  // if there are multiple URLs, display a dropdown next
                  // to the login button
                  loginOptions[i].length > 1 && (
                    <Select
                      isClearable
                      isSearchable
                      options={loginOptions[i]}
                      filterOptions={filterOptions[i]}
                      onChange={option => this.selectChange(option, i)}
                      value={this.state.selectedLoginOption &&
                        this.state.selectedLoginOption[i]}
                    />
                  )
                }
                <Button
                  className='login-page__entry-button'
                  onClick={() => {
                    window.location.href = getLoginUrl(
                      loginOptions[i].length > 1 ?
                        this.state.selectedLoginOption[i].value :
                        loginOptions[i][0].value,
                      next,
                    );
                  }}
                  label={p.name}
                  buttonType={p.secondary ? 'default' : 'primary'}
                />
              </div>
            </div>
          </React.Fragment>
        ),
      );
    }

    return (
      <div className='login-page'>
        <div className='login-page__side-box login-page__side-box--left' style={customImageStyle} />
        <div className='login-page__central-content'>
          <div className='h1-typo login-page__title'>
            {this.props.data.title}
          </div>
          <div className='high-light login-page__sub-title'>
            {this.props.data.subTitle}
          </div>
          <hr className='login-page__separator' />
          <div className='body-typo'>{this.props.data.text}</div>
          { loginComponent }
          <div>
            {this.props.data.contact}
            { (this.props.data.email && !this.props.data.contact_link) &&
              <a href={`mailto:${this.props.data.email}`}>
                {this.props.data.email}
              </a>
            }
            {
              this.props.data.contact_link &&
              <a href={this.props.data.contact_link.href}>
                {this.props.data.contact_link.text
                  ? this.props.data.contact_link.text
                  : this.props.data.contact_link.href}
              </a>
            }
            {'.'}
          </div>
        </div>
        <div className='login-page__side-box login-page__side-box--right' style={customImageStyle} />
      </div>
    );
  }
}

Login.propTypes = {
  providers: PropTypes.arrayOf(
    PropTypes.objectOf(PropTypes.any),
  ),
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
  providers: [],
};

export default Login;
