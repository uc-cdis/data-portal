import React from 'react';
import querystring from 'querystring';
import PropTypes from 'prop-types'; // see https://github.com/facebook/prop-types#prop-types
import MediaQuery from 'react-responsive';
import Button from '@gen3/ui-component/dist/components/Button';
import { basename, loginPath, breakpoints } from '../localconf';
import { components } from '../params';

import SlidingWindow from '../components/SlidingWindow';
import './Login.less';

const getInitialState = height => ({ height });

class Login extends React.Component {
  static propTypes = {
    providers: PropTypes.arrayOf(
      PropTypes.objectOf(PropTypes.any),
    ),
    location: PropTypes.object.isRequired,
    dictIcons: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
  };

  static defaultProps = {
    providers: [
      {
        id: 'google',
        name: 'Google OAuth',
        url: `${loginPath}google/`,
      },
    ],
  };

  constructor(props) {
    super(props);
    this.state = getInitialState(window.innerHeight - 221);
    this.resetState = this.resetState.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);
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

  render() {
    let next = basename;
    const location = this.props.location; // this is the react-router "location"
    const queryParams = querystring.parse(location.search ? location.search.replace(/^\?+/, '') : '');
    if (queryParams.next) {
      next = basename === '/' ? queryParams.next : basename + queryParams.next;
    }
    const customImage = components.login && components.login.image ?
      components.login.image
      : 'gene';

    return (
      <div className='login-page'>
        <MediaQuery query={`(min-width: ${breakpoints.tablet + 1}px)`}>
          <div className='login-page__side-box'>
            <SlidingWindow
              iconName={customImage}
              dictIcons={this.props.dictIcons}
              height={this.state.height}
              scrollY={window.scrollY}
            />
          </div>
        </MediaQuery>
        <div className='login-page__central-content'>
          <div className='h1-typo login-page__title'>
            {this.props.data.title}
          </div>
          <div className='high-light login-page__sub-title'>
            {this.props.data.subTitle}
          </div>
          <hr className='login-page__separator' />
          <div className='body-typo'>{this.props.data.text}</div>
          {
            this.props.providers.map(
              (p, i) => (
                <Button
                  key={i}
                  className='login-page__entries'
                  onClick={() => {
                    window.location.href = `${p.url}?redirect=${window.location.origin}${next}`;
                  }}
                  label={p.name}
                  buttonType='primary'
                />
              ),
            )
          }
          <div>
            {this.props.data.contact}
            <a href={`mailto:${this.props.data.email}`}>
              {this.props.data.email}
            </a>{'.'}
          </div>
        </div>
        <MediaQuery query={`(min-width: ${breakpoints.tablet + 1}px)`}>
          <div className='login-page__side-box--right'>
            <SlidingWindow
              iconName={customImage}
              dictIcons={this.props.dictIcons}
              height={this.state.height}
              scrollY={window.scrollY}
            />
          </div>
        </MediaQuery>
      </div>
    );
  }
}

export default Login;
