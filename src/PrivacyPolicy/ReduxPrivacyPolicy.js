import { connect } from 'react-redux';
import showdown from 'showdown';
import PrivacyPolicy from './PrivacyPolicy';

const mapStateToProps = state => ({
  text: state.privacyPolicy,
  loaded: !!state.privacyPolicy,
});

const mapDispatchToProps = dispatch => ({
  loadPrivacyPolicy: () => {
    fetch('/src/privacy_policy.md').then(
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
    );
  },
});

const ReduxPrivacyPolicy = connect(mapStateToProps, mapDispatchToProps)(PrivacyPolicy);

export default ReduxPrivacyPolicy;
