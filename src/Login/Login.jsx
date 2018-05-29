import React from 'react';
import styled from 'styled-components';
import querystring from 'querystring';
import PropTypes from 'prop-types'; // see https://github.com/facebook/prop-types#prop-types

import { basename, appname } from '../localconf';
import SlidingWindow from '../components/SlidingWindow';

const CentralBox = styled.div`
  text-align: center;
  width: 756px;
  margin: auto 0px;
  padding: 0px 100px;
  vertical-align: middle;
  display: table-cell;
  color: #000000;
`;

const LoginFrame = styled.div`
  display: table;
`;

const LeftBox = styled.div`
  width: 257px;
  text-align: center;
  padding: 0px;
  float: left;
  min-height: 100%;
`;

const RightBox = styled.div`
  width: 257px;
  text-align: center;
  padding: 0px;
  float: right;
  min-height: 100%;
`;

const Line = styled.hr`
  width: 30px;
  height: 5px;
  text-align: center;
  color: #9b9b9b;
  background-color: #9b9b9b;
  text-align: center;
  margin: 17px auto;
`;

export const LoginButton = styled.a`
  font-size: 1em;
`;

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
      <LoginFrame>
        <LeftBox style={{ height: `${this.state.height}px` }}>
          <SlidingWindow
            iconName={'gene'}
            dictIcons={this.props.dictIcons}
            height={this.state.height}
            scrollY={window.scrollY}
          />
        </LeftBox>
        <CentralBox>
          <div className="h1-typo" style={{ marginBottom: '11px', lineHeight: '40px' }}>{this.props.data.title}</div>
          <div className="high-light" style={{ textTransform: 'uppercase' }}>{this.props.data.subTitle}</div>
          <Line />
          <div className="body-typo">{this.props.data.text}</div>
          {
            this.props.providers.map(
              p => (
                <div key={p.id} style={{ margin: '25px 0px' }}>
                  <LoginButton href={`${p.url}?redirect=${window.location.origin}${next}`}>
                    <button className="button-primary-orange">
                      {p.name}
                    </button>
                  </LoginButton>
                </div>
              ),
            )
          }
          <div>{this.props.data.contact}</div>
        </CentralBox>
        <RightBox style={{ height: `${this.state.height}px` }}>
          <SlidingWindow
            iconName={'gene'}
            dictIcons={this.props.dictIcons}
            height={this.state.height}
            scrollY={window.scrollY}
          />
        </RightBox>
      </LoginFrame>
    );
  }
}

export default Login;
