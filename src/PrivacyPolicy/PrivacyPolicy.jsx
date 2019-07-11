import React from 'react';
import Spinner from '../components/Spinner';
import showdown from 'showdown';

class PrivacyPolicy extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.dispatch((dispatch) => {
      return fetch('/src/privacy_policy.md').then(
        response => response.text().then(
          text => {
            const converter = new showdown.Converter();
            const html = converter.makeHtml(text);
            dispatch({
              type: 'LOAD_PRIVACY_POLICY',
              value: html,
            })
          }),
        error => {
          ''
        },
      );
    });
  }

  shouldComponentUpdate(nextProps) {
    return (!this.props.loaded && nextProps.loaded)
  }

  render() {
    if (!this.props.loaded) {
      return <Spinner />;
    } else if (this.props.text) {
      return (
        <div className='privacy-policy'>
          <p dangerouslySetInnerHTML={{__html: this.props.text}}>
          </p>
        </div>
      )
    } else {
      // otherwise we'll try to redirect to the url according to the environment variable
      const url = process.env.PRIVACY_POLICY_URL;
      if (url) {
        // redirect to given URL
        this.props.history.push(url);
      } else {
        return ''
      }
    }
  }
}

export default PrivacyPolicy;
