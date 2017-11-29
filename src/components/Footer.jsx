import styled from 'styled-components';
import { Link } from 'react-router-dom';
import React from 'react';
import PropTypes from 'prop-types';
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

const Footer = ({ dictionaryVersion, apiVersion }) =>
  (<FooterSection>
    <NavRight>
      <Dictionary to="/dd"><span className="fui-bookmark" />View dictionary</Dictionary>
      <Versions>Dictionary v{dictionaryVersion}, API v{apiVersion}, Portal v{portalVersion}</Versions>
    </NavRight>
  </FooterSection>);

Footer.propTypes = {
  dictionaryVersion: PropTypes.string,
  apiVersion: PropTypes.string,
};

Footer.defaultProps = {
  dictionarVersion: null,
  apiVersion: null,
};

Footer.defaultProps = {
  dictionaryVersion: 'Unknown',
  apiVersion: 'Unknown',
};

export default Footer;
