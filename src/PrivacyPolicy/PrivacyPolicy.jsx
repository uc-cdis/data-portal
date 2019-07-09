import React from 'react';
import Spinner from '../components/Spinner';

class PrivacyPolicy extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    this.props.loadPolicy();
    console.log('render');
    console.log(this.props.loaded)
    if (!this.props.loaded) {
      console.log('not loaded')
      return <Spinner />;
    } else if (this.props.asdf) {
      console.log('loaded')
      return (
        <div className='privacy-policy'>
          {this.props.asdf}
        </div>
      )
    } else {
      // otherwise we'll try to redirect to the url according to the environment variable
      const url = process.env.PRIVACY_POLICY_URL;
      if (url) {
        // redirect to given URL
        this.props.history.push(url);
      } else {
        return null
      }
    }
  }
}

export default PrivacyPolicy;
