import { connect } from 'react-redux';
import PrivacyPolicy from './PrivacyPolicy';

const mapStateToProps = state => ({
  text: state.privacyPolicy,
  loaded: !!state.privacyPolicy,
});

const mapDispatchToProps = dispatch => ({
  dispatch,
});

const ReduxPrivacyPolicy = connect(mapStateToProps, mapDispatchToProps)(PrivacyPolicy);

export default ReduxPrivacyPolicy;
