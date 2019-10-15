import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import TopIconButton from './TopIconButton';
import './TopBar.less';
import { useArboristUI } from '../../configs';
import { userHasMethodOnAnyProject } from '../../authMappingUtils';

/**
 * NavBar renders row of nav-items of form { name, icon, link }
 */
class TopBar extends Component {
  isActive = id => this.props.activeTab === id;

  render() {
    return (
      <div className='top-bar'>
        <header className='top-bar__header'>
          <nav className='top-bar__nav'>
            {
              this.props.topItems.map(
                item => {
                  var buttonText = item.name
                  if (item.name === 'Submit Data' && useArboristUI) {
                    if (userHasMethodOnAnyProject('create', this.props.userAuthMapping)) {
                      buttonText = 'Submit/Browse Data'
                    } else {
                      buttonText = 'Browse Data'
                    }
                  }
                  return (item.link.startsWith('http')) ?
                    <a
                      className='top-bar__link'
                      key={item.link}
                      href={item.link}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <TopIconButton
                        name={buttonText}
                        icon={item.icon}
                        isActive={this.isActive(item.link)}
                        onActiveTab={() => this.props.onActiveTab(item.link)}
                      />
                    </a> :
                    <Link
                      className='top-bar__link'
                      key={item.link}
                      to={item.link}
                    >
                      <TopIconButton
                        name={buttonText}
                        icon={item.icon}
                        isActive={this.isActive(item.link)}
                        onActiveTab={() => this.props.onActiveTab(item.link)}
                      />
                    </Link>
                }
              )
            }
            {
              this.props.user.username !== undefined
              &&
              (
                <React.Fragment>
                  <Link className='top-bar__link' to='/identity'>
                    <TopIconButton
                      icon='user-circle'
                      name={this.props.user.username}
                      isActive={this.isActive('/identity')}
                      onActiveTab={() => this.props.onActiveTab('/identity')}
                    />
                  </Link>
                  <Link className='top-bar__link' to='#' onClick={this.props.onLogoutClick}>
                    <TopIconButton
                      icon='exit'
                      name='Logout'
                    />
                  </Link>
                </React.Fragment>
              )
            }
          </nav>
        </header>
      </div>
    );
  }
}

TopBar.propTypes = {
  topItems: PropTypes.array.isRequired,
  user: PropTypes.shape({ username: PropTypes.string }).isRequired,
  userAuthMapping: PropTypes.object.isRequired,
  activeTab: PropTypes.string,
  onActiveTab: PropTypes.func,
  onLogoutClick: PropTypes.func.isRequired,
};

TopBar.defaultProps = {
  activeTab: '',
  onActiveTab: () => {},
};

export default TopBar;
