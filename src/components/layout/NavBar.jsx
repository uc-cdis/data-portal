import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import NavButton from './NavButton';

const NavLeft = styled.nav`
  float: left;
  display: inline-block;
`;

const Header = styled.header`
  background-size: auto 48px;
  background-repeat: no-repeat; 
  background-color: white;
  overflow: hidden;
  margin: auto;
  width: 1220px;
  vertical-align: middle;
`;

const NavRight = styled.nav`
  float: right;
  color: white;
  overflow: hidden;
`;

const NavHome = styled(Link)`
  padding: 4px 0px 0px 0px;
  display: inline-block;
  text-align: center;
  vertical-align: middle;
  color: #606060;
  &:hover {
    color: #000000;
    border-bottom: 3px solid #ef8523;
  }
  &:active {
    color: #000000;
    border-bottom: 3px solid #ef8523;
  }
`;

const NavLogo = styled.div`
  padding: 8px 0px;
  display: inline-block;
  text-align: center;
  vertical-align: middle;
  color: #606060;
`;

// TODO: due to issue https://github.com/styled-components/styled-components/issues/439,
// bgcolor prop triggers react warning now, need to fix
const NavItem = styled(Link)`
  border-left: 1px solid #d1d1d1;
  &:last-child {
    border-right: 1px solid #d1d1d1;
  }
  height: 100%;
  display: inline-block;
  text-align: center;
`;

const NavA = styled.a`  
  border-left: 1px solid #d1d1d1;
  &:last-child {
    border-right: 1px solid #d1d1d1;
  }
  height: 100%;
  display: inline-block;
  text-align: center;
`;

const HomeButton = styled.div`
  padding: 0px 10px;
  display: inline-block;
`;

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
      <div style={{ width: '100%', backgroundColor: 'white', borderBottom: '1px solid #d1d1d1' }}>
        <Header>
          <NavLeft>
            <NavLogo>
              <img
                src="/src/img/logo.png"
                style={{ height: '64px',
                  display: 'block',
                  paddingRight: '8px',
                  borderRight: '1px solid #d1d1d1' }}
                alt=""
              />
            </NavLogo>
            <HomeButton onClick={() => this.props.onActiveTab('')}>
              <NavHome className="h3-typo" to="">
                {this.props.navTitle}
              </NavHome>
            </HomeButton>
          </NavLeft>
          <NavRight>
            {
              this.props.navItems.map(
                item => (
                  (item.link.startsWith('http')) ?
                    <NavA key={item.link} href={item.link}>
                      <NavButton
                        item={item}
                        dictIcons={this.props.dictIcons}
                        isActive={this.isActive(item.link)}
                        onActiveTab={() => this.props.onActiveTab(item.link)}
                      />
                    </NavA> :
                    <NavItem key={item.link} to={item.link}>
                      <NavButton
                        item={item}
                        dictIcons={this.props.dictIcons}
                        isActive={this.isActive(item.link)}
                        onActiveTab={() => this.props.onActiveTab(item.link)}
                      />
                    </NavItem>
                ),
              )
            }
          </NavRight>
        </Header>
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
