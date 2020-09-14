import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import MediaQuery from 'react-responsive';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import NavButton from './NavButton';
import NavBarTooltip from './NavBarTooltip';
import { breakpoints } from '../../localconf';
import { config, components } from '../../params';
import './NavBar.less';

/**
 * NavBar renders row of nav-items of form { name, icon, link }
 * @param { dictIcons, navTitle, navItems } params
 */
class NavBar extends Component {
  constructor(props) {
    super(props);
    this.navButtonRefs = {};
    this.state = {
      menuOpen: false,
      tooltipDetails: { content: '' },
    };
  }

  componentDidMount() {
    this.props.onInitActive();
  }

  getNavButtonRef = (itemUniqueId) => {
    if (!this.navButtonRefs[itemUniqueId]) {
      this.navButtonRefs[itemUniqueId] = React.createRef();
    }
    return this.navButtonRefs[itemUniqueId];
  }

  canUserSeeComponent = (componentName) => {
    const authResult = this.props.userAccess[componentName];
    return typeof authResult !== 'undefined' ? authResult : true;
  }

  isActive = (id) => {
    const toCompare = this.props.activeTab.split('/').filter(x => x !== 'dev.html').join('/');
    return toCompare.startsWith(id);
  }

  toggleMenu = () => {
    this.setState(prevState => ({ menuOpen: !prevState.menuOpen }));
  }

  updateTooltip(item) {
    /*
    - `item.tooltip` is a string: display it on mouse hover
    - `item.tooltip` is null/empty string: no tooltip text for this button
    - `item` is null: mouse is not over a button
    */
    let tooltipDetails = { content: '' };
    if (item && item.tooltip) {
      const boundsRect = this.navButtonRefs[item.link].current.getBoundingClientRect();
      const bottomY = boundsRect.bottom + window.scrollY;
      const centerX = boundsRect.x + (boundsRect.width / 2);
      tooltipDetails = {
        content: item.tooltip,
        x: centerX,
        y: bottomY + 5,
      };
    }
    if (tooltipDetails.content === this.state.tooltipDetails.content) {
      return;
    }
    this.setState({ tooltipDetails });
  }

  render() {
    const navItems = this.props.navItems.map(
      (item, index) => {
        const navButton = (<div
          key={item.link}
          ref={this.getNavButtonRef(item.link)}
          className='nav-bar__link nav-bar__link--right'
          onMouseOver={() => this.updateTooltip(item)}
          onMouseLeave={() => this.updateTooltip(null)}
        >
          { item.link.startsWith('http') ?
            (<a href={item.link}>
              <NavButton
                item={item}
                dictIcons={this.props.dictIcons}
                isActive={this.isActive(item.link)}
                onActiveTab={() => this.props.onActiveTab(item.link)}
                tabIndex={index + 1}
              />
            </a>)
            :
            (<Link to={item.link}>
              <NavButton
                item={item}
                dictIcons={this.props.dictIcons}
                isActive={this.isActive(item.link)}
                onActiveTab={() => this.props.onActiveTab(item.link)}
                tabIndex={index + 1}
              />
            </Link>)
          }
        </div>);
        return this.canUserSeeComponent(item.name) ? navButton : null;
      });

    return (
      <div className='nav-bar'>
        <header className='nav-bar__header'>
          <nav className='nav-bar__nav--info'>
            <div className='nav-bar__logo'>
              {config.homepageHref ? (
                <a href={config.homepageHref}>
                  <img
                    className='nav-bar__logo-img'
                    src='/src/img/logo.png'
                    alt={components.homepageAltText || ''}
                  />
                </a>
              ) : (
                <Link
                  to=''
                  onClick={() => this.props.onActiveTab('')}
                  onKeyPress={() => this.props.onActiveTab('')}
                >
                  <img
                    className='nav-bar__logo-img'
                    src='/src/img/logo.png'
                    alt={components.homepageAltText || ''}
                  />
                </Link>
              )
              }
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
            { this.state.tooltipDetails.content !== '' ?
              <NavBarTooltip {...this.state.tooltipDetails} />
              : null }
          </MediaQuery>
        </header>
      </div>
    );
  }
}

NavBar.propTypes = {
  navItems: PropTypes.array.isRequired,
  userAccess: PropTypes.object.isRequired,
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
