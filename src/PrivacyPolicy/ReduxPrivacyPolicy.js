import { connect } from 'react-redux';
import DOMPurify from 'dompurify';
import { marked } from 'marked';

import { components } from '../params';
import PrivacyPolicy from './PrivacyPolicy';

const mapStateToProps = (state) => ({
  text: state.privacyPolicy,
  loaded: !!state.privacyPolicy,
});

const mapDispatchToProps = (dispatch) => ({
  loadPrivacyPolicy: () => {
    fetch(components.privacyPolicy.file).then(
      (response) => {
        if (response.ok) {
          response.text().then(
            (text) => {
              const html = DOMPurify.sanitize(marked.parse(text));
              dispatch({
                type: 'LOAD_PRIVACY_POLICY',
                value: html,
              });
            });
        }
      },
      (_) => '', // eslint-disable-line no-unused-vars
    );
  },
});

const ReduxPrivacyPolicy = connect(mapStateToProps, mapDispatchToProps)(PrivacyPolicy);

export default ReduxPrivacyPolicy;
