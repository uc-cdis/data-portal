import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Popover } from 'antd';
import PropTypes from 'prop-types';
import TopIconButton from './TopIconButton';
import './TopBar.less';
import { useArboristUI, hideSubmissionIfIneligible } from '../../configs';
import { discoveryConfig } from '../../localconf';
import { userHasCreateOrUpdateOnAnyProject } from '../../authMappingUtils';

const isEmailAddress = (input) => {
  // regexp for checking if a string is possibly an email address, got from https://www.w3resource.com/javascript/form/email-validation.php
  const regexp = '^[a-zA-Z0-9.!#$%&\'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$';
  return new RegExp(regexp).test(input);
};

/**
 * NavBar renders row of nav-items of form { name, icon, link }
 */
class TopBar extends Component {
  isActive = (id) => this.props.activeTab === id;

  render() {
    return (
      <div className='top-bar'>
        <header className='top-bar__header'>
          <nav className='top-bar__nav'>
            {
              this.props.topItems.filter(
                (item) => {
                  if (item.name === 'Submit Data' && useArboristUI && hideSubmissionIfIneligible) {
                    if (userHasCreateOrUpdateOnAnyProject(this.props.userAuthMapping)) {
                      return true;
                    }
                    return false;
                  }
                  return true;
                },
              ).map(
                (item) => {
                  let buttonText = item.name;
                  if (item.name === 'Submit Data' && useArboristUI) {
                    if (userHasCreateOrUpdateOnAnyProject(this.props.userAuthMapping)) {
                      buttonText = 'Submit/Browse Data';
                    } else {
                      buttonText = 'Browse Data';
                    }
                  }
                  const isLinkEmailAddress = isEmailAddress(item.link);
                  if (isLinkEmailAddress || item.link.startsWith('http')) {
                    const itemHref = (isLinkEmailAddress) ? `mailto:${item.link}` : item.link;
                    return (
                      <a
                        className='top-bar__link g3-ring-on-focus'
                        key={itemHref}
                        href={itemHref}
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        <TopIconButton
                          name={buttonText}
                          icon={item.icon}
                          isActive={this.isActive(itemHref)}
                          onActiveTab={() => this.props.onActiveTab(itemHref)}
                          tabIndex='-1'
                        />
                      </a>
                    );
                  }
                  return (
                    <Link
                      className='top-bar__link g3-ring-on-focus'
                      key={item.link}
                      to={item.link}
                    >
                      <TopIconButton
                        name={buttonText}
                        icon={item.icon}
                        isActive={this.isActive(item.link)}
                        onActiveTab={() => this.props.onActiveTab(item.link)}
                        tabIndex='-1'
                      />
                    </Link>
                  );
                },
              )
            }
            {
              this.props.user.username !== undefined && this.props.useProfileDropdown !== true
              && (
                <React.Fragment>
                  <Link className='top-bar__link g3-ring-on-focus' to='/identity'>
                    <TopIconButton
                      icon='user-circle'
                      name={this.props.user.username}
                      isActive={this.isActive('/identity')}
                      onActiveTab={() => this.props.onActiveTab('/identity')}
                      tabIndex='-1'
                    />
                  </Link>
                  <Link className='top-bar__link g3-ring-on-focus' to='#' onClick={this.props.onLogoutClick}>
                    <TopIconButton
                      icon='exit'
                      name='Logout'
                      tabIndex='-1'
                    />
                  </Link>
                </React.Fragment>
              )
            }
            {
              this.props.user.username !== undefined && this.props.useProfileDropdown === true
              && (
                <Popover
                  title={this.props.user.username}
                  placement='bottomRight'
                  content={(
                    <React.Fragment>
                      <Link to='/identity'>View Profile</Link>
                      <br />
                      <Link to='#' onClick={this.props.onLogoutClick}>Logout</Link>
                    </React.Fragment>
                  )}
                >
                  <Link className='top-bar__link g3-ring-on-focus' to='#'>
                    <TopIconButton
                      icon='user-circle'
                      name=''
                      isActive={this.isActive('/identity')}
                      onActiveTab={() => this.props.onActiveTab('/identity')}
                      tabIndex='-1'
                    />
                  </Link>
                </Popover>
              )
            }
            {
              typeof this.props.user.username === 'undefined'
              && (
                <React.Fragment>
                  <Link
                    className='top-bar__link g3-ring-on-focus'
                    to={
                      (() => {
                        if (this.props.activeTab === '/discovery') {
                          // describes the state, filters of the discovery page to reload after redirect
                          const serializableState = {
                            ...this.props.discovery,
                            actionToResume: null,
                            // reduce the size of the redirect url by only storing study id
                            // study id is remapped to it study after redirect and studies load in root index component
                            selectedResourceIDs: this.props.discovery.selectedResources.map(
                              (resource) => resource[discoveryConfig.minimalFieldMapping.uid],
                            ),
                          };
                          delete serializableState.selectedResources;
                          const queryStr = `?state=${encodeURIComponent(JSON.stringify(serializableState))}`;
                          return {
                            pathname: '/login',
                            from: `/discovery${queryStr}`,
                          };
                        }
                        return '/login';
                      })()
                    }
                  >
                    <TopIconButton
                      icon='exit'
                      name='Login'
                      tabIndex='-1'
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
  useProfileDropdown: PropTypes.bool,
  user: PropTypes.shape({ username: PropTypes.string }).isRequired,
  userAuthMapping: PropTypes.object.isRequired,
  activeTab: PropTypes.string,
  onActiveTab: PropTypes.func,
  onLogoutClick: PropTypes.func.isRequired,
  discovery: PropTypes.shape({ selectedResources: PropTypes.array }).isRequired,
};

TopBar.defaultProps = {
  useProfileDropdown: false,
  activeTab: '',
  onActiveTab: () => {},
};

export default withRouter(TopBar);
