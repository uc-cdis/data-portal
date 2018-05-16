import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import TopIconButton from './TopIconButton';

const Header = styled.header`
  background-color: #3283c8;
  overflow: hidden;
  vertical-align: middle;
  margin: auto;
  width: 1216px;
`;

const TopRight = styled.nav`
  float: right;
  color: white;
  overflow: hidden;
`;

// TODO: due to issue https://github.com/styled-components/styled-components/issues/439,
const TopItem = styled(Link)`
  border-right: 1px solid #9b9b9b;
  &:last-child {
    border-right: 0px;
  }
  height: 40px;
  display: inline-block;
  text-align: center;
  vertical-align: middle;
  padding: 10px 0px;
`;

const TopA = styled.a`  
  border-right: 1px solid #9b9b9b;
  &:last-child {
    border-right: 0px;
  }
  height: 40px;
  display: inline-block;
  text-align: center;
  vertical-align: middle;
  padding: 10px 0px;
`;

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
      <div style={{ width: '100%', backgroundColor: '#3283c8' }}>
        <Header>
          <TopRight>
            {
              this.props.topItems.map(
                item => (
                  (item.link.startsWith('http')) ?
                    <TopA key={item.link} href={item.link} target="_blank">
                      <TopIconButton
                        dictIcons={this.props.dictIcons}
                        item={item}
                        isActive={this.isActive(item.link)}
                        onActiveTab={() => this.props.onActiveTab(item.link)}
                      />
                    </TopA> :
                    <TopItem key={item.link} to={item.link}>
                      <TopIconButton
                        dictIcons={this.props.dictIcons}
                        item={item}
                        isActive={this.isActive(item.link)}
                        onActiveTab={() => this.props.onActiveTab(item.link)}
                      />
                    </TopItem>
                ),
              )
            }
            {
              this.props.user.username !== undefined && <TopItem to="#" onClick={this.props.onLogoutClick}>
                <TopIconButton
                  dictIcons={this.props.dictIcons}
                  item={{ name: this.props.user.username, icon: 'exit' }}
                />
              </TopItem>
            }
          </TopRight>
        </Header>
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
