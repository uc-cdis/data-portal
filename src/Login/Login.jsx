import React from 'react';
import querystring from 'querystring';
import PropTypes from 'prop-types'; // see https://github.com/facebook/prop-types#prop-types
import MediaQuery from 'react-responsive';
import AutoComplete from '@gen3/ui-component/dist/components/AutoComplete';
import Button from '@gen3/ui-component/dist/components/Button';
import { basename, loginPath, breakpoints } from '../localconf';
import { components } from '../params';

import SlidingWindow from '../components/SlidingWindow';
import './Login.less';

const getInitialState = height => ({ height });

const getLoginUrl = (providerLoginUrl, next) => {
  const queryChar = providerLoginUrl.includes('?') ? '&' : '?';
  return `${providerLoginUrl}${queryChar}redirect=${window.location.origin}${next}`;
};

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
        idp: 'google',
        name: 'Google OAuth',
        urls: [{
          name: 'Google OAuth',
          url: `${loginPath}google/`,
        }],
      },
    ],
  };

  constructor(props) {
    super(props);
    this.state = getInitialState(window.innerHeight - 221);
    this.resetState = this.resetState.bind(this);
    this.updateDimensions = this.updateDimensions.bind(this);

    // using objects for autoCompleteRefs, suggestionLists and
    // currentLoginUrl because we need one for each login dropdown
    this.autoCompleteRefs = {};
    this.state = {
      suggestionLists: {},
      currentLoginUrl: {},
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

  /**
   * When the contents of the input field are updated, filter the list
   * of suggestions
   */
  inputChangeFunc = (inputText, index) => {
    const text = inputText.toLowerCase();
    if (!text) {
      return;
    }

    const urls = this.props.providers[index].urls;
    const matches = [];
    urls.forEach((e) => {
      const start = e.name.toLowerCase().indexOf(text.toLowerCase());
      if (start >= 0) {
        const end = start + text.length;
        matches.push({
          fullString: e.name, // matched string
          loginUrl: e.url,
          // we could highlight multiple matches - for now, only first match
          matchedPieceIndices: [[start, end]], // match location
        });
      }
    });

    const suggestionListsCopy = { ...this.state.suggestionLists };
    suggestionListsCopy[index] = matches;

    this.setState({
      suggestionLists: suggestionListsCopy,
    });
  };

  /**
   * When an item from the dropdown is selected, update the contents of
   * the input field and update the current login URL
   */
  suggestionItemClickFunc = (suggestionItem, index) => {
    this.autoCompleteRefs[index].current.setInputText(suggestionItem.fullString);

    const currentLoginUrlCopy = { ...this.state.currentLoginUrl };
    currentLoginUrlCopy[index] = suggestionItem.loginUrl;
    this.setState({
      currentLoginUrl: currentLoginUrlCopy,
    });
  };

  listAllOptions = (index) => {
    const allOptions = this.props.providers[index].urls.map(e => ({
      fullString: e.name,
      loginUrl: e.url,
      matchedPieceIndices: [],
    }));

    const suggestionListsCopy = { ...this.state.suggestionLists };
    suggestionListsCopy[index] = allOptions;
    this.setState({
      suggestionLists: suggestionListsCopy,
    });
  };

  clearAllOptions = (index) => {
    const suggestionListsCopy = { ...this.state.suggestionLists };
    suggestionListsCopy[index] = [];
    this.setState({
      suggestionLists: suggestionListsCopy,
    });
  };

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

    this.props.providers.forEach((provider, i) => {
      // for backwards compatibility, if "urls" does not exist,
      // generate it from the deprecated "url" field
      if (typeof provider.urls === 'undefined') {
        provider.urls = [{ // eslint-disable-line no-param-reassign
          name: provider.name,
          url: provider.url,
        }];
      }
      if (provider.urls.length > 1) {
        this.autoCompleteRefs[i] = React.createRef();
      }
    });

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
                <React.Fragment key={i}>
                  <div className='login-page__entries'>
                    { p.desc }
                    <div>
                      {
                        // if there are multiple URLs, display a dropdown next
                        // to the login button
                        p.urls.length > 1 && (
                          <AutoComplete
                            ref={this.autoCompleteRefs[i]}
                            suggestionList={this.state.suggestionLists[i]}
                            inputPlaceHolderText='Search login options'
                            onSuggestionItemClick={
                              suggestionItem => this.suggestionItemClickFunc(suggestionItem, i)
                            }
                            onInputChange={inputText => this.inputChangeFunc(inputText, i)}
                            // note: not using "onSubmitInput" as a "submit
                            // search" button but as a "list all options"
                            // button. if all options are already displayed,
                            // close the dropdown instead
                            inputIcon='chevron-down'
                            onSubmitInput={() => (
                              this.state.suggestionLists[i] &&
                              this.state.suggestionLists[i].length === p.urls.length ?
                                this.clearAllOptions(i) : this.listAllOptions(i)
                            )}
                          />
                        )
                      }
                      <Button
                        onClick={() => {
                          window.location.href = getLoginUrl(
                            p.urls.length > 1 ? this.state.currentLoginUrl[i] : p.urls[0],
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
