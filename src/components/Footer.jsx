import styled, { css } from 'styled-components';
import { Link } from 'react-router';
import React from 'react';
import { portalVersion } from '../versions';

const FooterSection = styled.footer`
  text-align: center;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.87);
  position:fixed;
  bottom:0;
  z-index:1000;
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
const Versions = styled.span`
  color: white;
  padding:5px;
`;

const defaults = {
  dictionaryVersion: "Unknown"
};

export function setDefaults(opts) {
  Object.assign(defaults, opts||{});
}

const Footer = ({ dictionaryVersion }) => {
  dictionaryVersion = dictionaryVersion || defaults.dictionaryVersion;
  apiVersion = apiVersion || defaults.apiVersion;
  return <FooterSection>
    <NavRight>
      <Dictionary to="/dd"><span className="fui-bookmark" />View dictionary</Dictionary>
      <Versions>Dictionary v{dictionaryVersion}, API v{apiVersion}, portal v{portalVersion}</Versions>
    </NavRight>
  </FooterSection>
};

export default Footer;
