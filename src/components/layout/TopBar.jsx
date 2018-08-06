import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import TopIconButton from './TopIconButton';
import './TopBar.less';

TopIconButton.propTypes = {
  item: PropTypes.shape({ name: PropTypes.string, icon: PropTypes.string }).isRequired,
  dictIcons: PropTypes.object.isRequired,
};

/**
 * NavBar renders row of nav-items of form { name, icon, link }
 * @param {dictIcons, topItems,user,onLogoutClick} params
 */
class TopBar extends Component {
  isActive = id => this.props.activeTab === id;

  render() {
    return (
      <div className="top-bar">
        <header className="top-bar__header">
          <nav className="top-bar__nav">
            {
              this.props.topItems.map(
                item => (
                  (item.link.startsWith('http')) ?
                    <a
                      className="top-bar__link"
                      key={item.link}
                      href={item.link}
                      target="_blank"
                    >
                      <TopIconButton
                        dictIcons={this.props.dictIcons}
                        item={item}
                        isActive={this.isActive(item.link)}
                        onActiveTab={() => this.props.onActiveTab(item.link)}
                      />
                    </a> :
                    <Link
                      className="top-bar__link"
                      key={item.link}
                      to={item.link}
                    >
                      <TopIconButton
                        dictIcons={this.props.dictIcons}
                        item={item}
                        isActive={this.isActive(item.link)}
                        onActiveTab={() => this.props.onActiveTab(item.link)}
                      />
                    </Link>
                ),
              )
            }
            {
              this.props.user.username !== undefined
              && <Link className="top-bar__link" to="#" onClick={this.props.onLogoutClick}>
                  <TopIconButton
                    dictIcons={this.props.dictIcons}
                    item={{ name: this.props.user.username, icon: 'exit' }}
                  />
                </Link>
            }
          </nav>
        </header>
      </div>
    );
  }
}

TopBar.propTypes = {
  dictIcons: PropTypes.object.isRequired,
  topItems: PropTypes.array.isRequired,
  user: PropTypes.shape({ username: PropTypes.string }).isRequired,
  activeTab: PropTypes.string,
  onActiveTab: PropTypes.func,
  onLogoutClick: PropTypes.func.isRequired,
};

TopBar.defaultProps = {
  activeTab: '',
  onActiveTab: () => {},
};

export default TopBar;
