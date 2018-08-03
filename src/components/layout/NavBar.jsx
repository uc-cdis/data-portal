import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import NavButton from './NavButton';
import './NavBar.less';

/**
 * NavBar renders row of nav-items of form { name, icon, link }
 * @param { dictIcons, navTitle, navItems } params
 */
class NavBar extends Component {
  componentDidMount() {
    this.props.onInitActive();
  }

  isActive = id => this.props.activeTab === id;

  render() {
    return (
      <div className="nav-bar">
        <header className="nav-bar__header">
          <nav className="nav-bar__nav--left">
            <div className="nav-bar__logo">
              <img
                className="nav-bar__logo-img"
                src="/src/img/logo.png"
                alt=""
              />
            </div>
            <div className="nav-bar__home-button" onClick={() => this.props.onActiveTab('')}>
              <Link className="h3-typo nav-bar__link nav-bar__link--home" to="">
                {this.props.navTitle}
              </Link>
            </div>
          </nav>
          <nav className="nav-bar__nav--right">
            {
              this.props.navItems.map(
                item => (
                  (item.link.startsWith('http')) ?
                    <a className="nav-bar__link nav-bar__link--right" key={item.link} href={item.link}>
                      <NavButton
                        item={item}
                        dictIcons={this.props.dictIcons}
                        isActive={this.isActive(item.link)}
                        onActiveTab={() => this.props.onActiveTab(item.link)}
                      />
                    </a> :
                    <Link className="nav-bar__link nav-bar__link--right" key={item.link} to={item.link}>
                      <NavButton
                        item={item}
                        dictIcons={this.props.dictIcons}
                        isActive={this.isActive(item.link)}
                        onActiveTab={() => this.props.onActiveTab(item.link)}
                      />
                    </Link>
                ),
              )
            }
          </nav>
        </header>
      </div>
    );
  }
}

NavBar.propTypes = {
  navItems: PropTypes.array.isRequired,
  dictIcons: PropTypes.object.isRequired,
  navTitle: PropTypes.string.isRequired,
  activeTab: PropTypes.string,
  onActiveTab: PropTypes.func,
  onInitActive: PropTypes.func,
};

NavBar.defaultProps = {
  activeTab: '',
  onActiveTab: () => {},
  onInitActive: () => {},
};

export default NavBar;
