import { connect } from 'react-redux';
import GWASUI from './GWASUI';

const mapStateToProps = (state) => ({
  userAuthMapping: state.userAuthMapping,
});

const ReduxGWASUI = connect(mapStateToProps)(GWASUI);
export default ReduxGWASUI;
