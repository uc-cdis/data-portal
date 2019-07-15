import PropTypes from 'prop-types';
import React from 'react';
import showdown from 'showdown';
import Spinner from '../components/Spinner';
import './PrivacyPolicy.less';

class PrivacyPolicy extends React.Component {
  componentDidMount() {
    this.props.dispatch(dispatch => fetch('/src/privacy_policy.md').then(
      response => response.text().then(
        (text) => {
          const converter = new showdown.Converter();
          const html = converter.makeHtml(text);
          dispatch({
            type: 'LOAD_PRIVACY_POLICY',
            value: html,
          });
        }),
      _ => '', // eslint-disable-line no-unused-vars
    ));
  }

  shouldComponentUpdate(nextProps) {
    return (!this.props.loaded && nextProps.loaded);
  }

  /* eslint-disable react/no-danger */
  render() {
    if (!this.props.loaded) {
      return <Spinner />;
    } else if (this.props.text) {
      return (
        <div className='privacy-policy'>
          <p dangerouslySetInnerHTML={{ __html: this.props.text }} />
        </div>
      );
    }
    // otherwise we'll try to redirect to the url according to the environment variable
    const url = process.env.PRIVACY_POLICY_URL;
    if (url) {
      // redirect to given URL
      this.props.history.push(url);
    }
    return '';
  }
}

PrivacyPolicy.propTypes = {
  dispatch: PropTypes.function.isRequired,
  history: PropTypes.object.isRequired,
  text: PropTypes.string.isRequired,
  loaded: PropTypes.bool.isRequired,
};

export default PrivacyPolicy;
