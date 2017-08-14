import styled, { css } from 'styled-components';
import { Link } from 'react-router';
import React from 'react';

const FooterSection = styled.footer`
  position: fixed;
  bottom: 0px;
  left: 0px;
  width: 100%;
  height: 100px;
  background: black;
  z-index: 1000;
`;

const Dictionary = styled(Link)`
  padding: 5px;
  span {
    margin-right: 5px;
  }
`;
const NavRight = styled.nav`
  width: 100%;
  padding: 30px 100px;
  color: white;
`;

const Footer = () => (
  <FooterSection>
    <NavRight>
      <ul>
          <Dictionary to='/dd'><span className='fui-bookmark'></span>View dictionary</Dictionary>
      </ul>
    </NavRight>
  </FooterSection>

)

export default Footer;
