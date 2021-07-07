import PropTypes from 'prop-types';
import React from 'react';
import Spinner from '../components/Spinner';
import { components } from '../params';
import './PrivacyPolicy.less';

class PrivacyPolicy extends React.Component {
  componentDidMount() {
    this.props.loadPrivacyPolicy();
  }

  shouldComponentUpdate(nextProps) {
    return (!this.props.loaded && nextProps.loaded);
  }

  /* eslint-disable react/no-danger */
  render() {
    if (!this.props.loaded) {
      return <Spinner />;
    } if (this.props.text) {
      return (
        <div className='privacy-policy'>
          <p dangerouslySetInnerHTML={{ __html: this.props.text }} />
        </div>
      );
    }
    // otherwise we'll try to redirect to the url according to the environment variable
    const url = components.privacyPolicy.routeHref;
    if (url) {
      // redirect to given URL
      this.props.history.push(url);
    }
    return null;
  }
}

PrivacyPolicy.propTypes = {
  loadPrivacyPolicy: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  text: PropTypes.string.isRequired,
  loaded: PropTypes.bool.isRequired,
};

export default PrivacyPolicy;
