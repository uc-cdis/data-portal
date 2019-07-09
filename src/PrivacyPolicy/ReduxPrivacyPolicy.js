import { connect } from 'react-redux';
import PrivacyPolicy from './PrivacyPolicy';

const mapStateToProps = state => {
  return ({
    asdf: state.asdf,
    loaded: true,
  })
};

const mapDispatchToProps = dispatch => ({
  loadPolicy: () => dispatch({ type: 'LOAD_PRIVACY_POLICY' }),
});

const ReduxPrivacyPolicy = connect(mapStateToProps, mapDispatchToProps)(PrivacyPolicy);

export default ReduxPrivacyPolicy;
