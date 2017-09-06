import styled, { css } from 'styled-components';
import { Link } from 'react-router';
import React from 'react';

const FooterSection = styled.footer`
  position: absolute;
  text-align: center;
  bottom: 0px;
  left: 0px;
  right: 0px;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.87);
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
  padding: 10px 100px;
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
