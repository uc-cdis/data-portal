import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NavButton from './NavButton';
import { breakpoints } from '../../localconf';
import './NavBar.less';

/**
 * NavBar renders row of nav-items of form { name, icon, link }
 * @param { dictIcons, navTitle, navItems } params
 */
class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false,
    };
  }

  componentDidMount() {
    this.props.onInitActive();
  }

  isActive = (id) => {
    const toCompare = this.props.activeTab.split('/').filter(x => x !== 'dev.html').join('/');
    return toCompare.startsWith(id);
  }

  toggleMenu = () => {
    this.setState(prevState => ({ menuOpen: !prevState.menuOpen }));
  }

  render() {
    const navItems = this.props.navItems.map(
      (item, index) => (
        (item.link.startsWith('http')) ?
          <a className='nav-bar__link nav-bar__link--right' key={item.link} href={item.link}>
            <NavButton
              item={item}
              dictIcons={this.props.dictIcons}
              isActive={this.isActive(item.link)}
              onActiveTab={() => this.props.onActiveTab(item.link)}
              tabIndex={index + 1}
            />
          </a> :
          <Link className='nav-bar__link nav-bar__link--right' key={item.link} to={item.link}>
            <NavButton
              item={item}
              dictIcons={this.props.dictIcons}
              isActive={this.isActive(item.link)}
              onActiveTab={() => this.props.onActiveTab(item.link)}
              tabIndex={index + 1}
            />
          </Link>
      ));

    return (
      <div className='nav-bar'>
        <header className='nav-bar__header'>
          <nav className='nav-bar__nav--info'>
            <div className='nav-bar__logo'>
              <Link
                to=''
                onClick={() => this.props.onActiveTab('')}
                onKeyPress={() => this.props.onActiveTab('')}
              >
                <img
                  className='nav-bar__logo-img'
                  src='/src/img/logo.png'
                  alt=''
                />
              </Link>
            </div>
            {
              this.props.navTitle && (
                <div
                  role='button'
                  tabIndex={0}
                  className='nav-bar__home-button'
                  onClick={() => this.props.onActiveTab('')}
                  onKeyPress={() => this.props.onActiveTab('')}
                >
                  <Link className='h3-typo nav-bar__link nav-bar__link--home' to=''>
                    {this.props.navTitle}
                  </Link>
                </div>
              )
            }
          </nav>
          <MediaQuery query={`(max-width: ${breakpoints.tablet}px)`}>
            <div
              className='nav-bar__menu'
              onClick={this.toggleMenu}
              role='button'
              tabIndex={0}
            >
              Menu
              <FontAwesomeIcon
                className='nav-bar__menu-icon'
                icon={this.state.menuOpen ? 'angle-down' : 'angle-up'}
                size='lg'
              />
            </div>
            {
              this.state.menuOpen ? (
                <nav className='nav-bar__nav--items'>
                  { navItems }
                </nav>
              ) : null
            }
          </MediaQuery>
          <MediaQuery query={`(min-width: ${breakpoints.tablet + 1}px)`}>
            <nav className='nav-bar__nav--items'>
              { navItems }
            </nav>
          </MediaQuery>
        </header>
      </div>
    );
  }
}

NavBar.propTypes = {
  navItems: PropTypes.array.isRequired,
  dictIcons: PropTypes.object.isRequired,
  navTitle: PropTypes.string,
  activeTab: PropTypes.string,
  onActiveTab: PropTypes.func,
  onInitActive: PropTypes.func,
};

NavBar.defaultProps = {
  activeTab: '',
  onActiveTab: () => {},
  onInitActive: () => {},
  navTitle: null,
};

export default NavBar;
