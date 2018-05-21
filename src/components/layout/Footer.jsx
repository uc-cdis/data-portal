import styled from 'styled-components';
import React from 'react';
import PropTypes from 'prop-types';
import { portalVersion } from '../../versions';
import IconComponent from '../Icon';

const FooterSection = styled.footer`
  width: 100%;
  background-color: #4a4a4a;
  text-align: center;
  vertical-align: middle;
  height: 100px;
`;

const FooterGroup = styled.nav`
  width: 1220px;
  color: white;
  vertical-align: middle;
  margin: auto;
  text-align: left;  
`;

const Versions = styled.div`
  color: white;
  margin-top: 10px;
  margin-bottom: 10px;
  border-left: 2px solid #458099;
  padding-left: 5px;
`;

const VersionsContainer = styled.div`
  margin: auto;
  vertical-align: middle;
  display: inline-block;
  width: 220px;
`;

const FooterIcon = styled.div`
  vertical-align: middle;
  margin-left: 40px;
  &:first-child {
    margin-left: 0;
  }
  height: 100px;
  position: relative;
  display: table;
`;

const Footer = ({ dictIcons, dictionaryVersion, apiVersion }) => (
  <FooterSection>
    <FooterGroup>
      <div style={{ display: 'inline-flex', float: 'left', width: '720px', height: '100px' }}>
        {
          [{ name: 'Dictionary', version: dictionaryVersion },
            { name: 'API', version: apiVersion },
            { name: 'Portal', version: portalVersion }].map(
            item => (<VersionsContainer><Versions key={item.name}>
              <div className="h4-typo" style={{ color: '#cdcdcd', verticalAlign: 'middle' }}>{item.name}</div>
              <div className="body-typo" style={{ color: 'white', verticalAlign: 'middle' }}>v{item.version}</div>
            </Versions></VersionsContainer>),
          )
        }
      </div>
      <div style={{ display: 'inline-flex', width: '500px' }}>
        <FooterIcon style={{ width: '70px' }}>
          <div style={{ verticalAlign: 'middle',
            display: 'table-cell',
          }}
          >
            <IconComponent dictIcons={dictIcons} iconName="gen3" height="37px" />
          </div>
        </FooterIcon>
        <FooterIcon style={{ width: '390px' }}>
          <div style={{ verticalAlign: 'middle',
            display: 'table-cell',
          }}
          >
            <IconComponent dictIcons={dictIcons} iconName="uchicago" height="37px" svgStyles={{ fill: '#ffffff' }} />
          </div>
        </FooterIcon>
      </div>
    </FooterGroup>
  </FooterSection>
);

Footer.propTypes = {
  dictIcons: PropTypes.object.isRequired,
  dictionaryVersion: PropTypes.string,
  apiVersion: PropTypes.string,
};

Footer.defaultProps = {
  dictionaryVersion: 'Unknown',
  apiVersion: 'Unknown',
};

export default Footer;
