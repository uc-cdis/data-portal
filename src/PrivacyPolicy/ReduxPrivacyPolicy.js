import { connect } from 'react-redux';
import MarkdownIt from 'markdown-it';
import { components } from '../params';
import PrivacyPolicy from './PrivacyPolicy';

const md = new MarkdownIt();

const mapStateToProps = (state) => ({
  text: state.privacyPolicy,
  loaded: !!state.privacyPolicy,
});

const mapDispatchToProps = (dispatch) => ({
  loadPrivacyPolicy: () => {
    fetch(components.privacyPolicy.file).then(
      (response) => {
        if (response.ok) {
          response.text().then((text) => {
            dispatch({
              type: 'LOAD_PRIVACY_POLICY',
              value: md.render(text),
            });
          });
        }
      },
      (_) => '' // eslint-disable-line no-unused-vars
    );
  },
});

const ReduxPrivacyPolicy = connect(
  mapStateToProps,
  mapDispatchToProps
)(PrivacyPolicy);

export default ReduxPrivacyPolicy;
