import { connect } from 'react-redux';
import { navBar, navItems } from '../localconf';
import dictIcons from '../img/icons/index';
import NavBar from '../components/NavBar';

const mapStateToProps = state => ({
  navTitle: navBar.title,
  navItems,
  dictIcons,
});

const mapDispatchToProps = dispatch => ({
});
const ReduxNavBar = connect(mapStateToProps, mapDispatchToProps)(NavBar);
export default ReduxNavBar;
