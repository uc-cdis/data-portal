import React from 'react';
import querystring from 'querystring';
import PropTypes from 'prop-types'; // see https://github.com/facebook/prop-types#prop-types

import { basename } from '../localconf';
import SlidingWindow from '../components/SlidingWindow';
import './Login.less';

const getInitialState = height => ({ height });

class Login extends React.Component {
  static propTypes = {
    providers: PropTypes.arrayOf(
      PropTypes.objectOf(PropTypes.any),
    ).isRequired,
    location: PropTypes.object.isRequired,
    dictIcons: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
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
    return (
      <div className='login-page'>
        <div className='login-page__side-box'>
          <SlidingWindow
            iconName={'gene'}
            dictIcons={this.props.dictIcons}
            height={this.state.height}
            scrollY={window.scrollY}
          />
        </div>
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
              p => (
                <div key={p.id} className='login-page__entries'>
                  <a href={`${p.url}?redirect=${window.location.origin}${next}`}>
                    <button className='button-primary-orange'>
                      {p.name}
                    </button>
                  </a>
                </div>
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
        <div className='login-page__side-box'>
          <SlidingWindow
            iconName={'gene'}
            dictIcons={this.props.dictIcons}
            height={this.state.height}
            scrollY={window.scrollY}
          />
        </div>
      </div>
    );
  }
}

export default Login;
