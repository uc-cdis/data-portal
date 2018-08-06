import React from 'react';
import PropTypes from 'prop-types';
import { portalVersion } from '../../versions';
import IconComponent from '../Icon';
import './Footer.less';

const Footer = ({ dictIcons, dictionaryVersion, apiVersion }) => (
  <footer className="footer">
    <nav className="footer__nav">
      <div className="footer__version-area">
        {
          [{ name: 'Dictionary', version: dictionaryVersion },
            { name: 'Submission', version: apiVersion },
            { name: 'Portal', version: portalVersion }].map(
            item => (
              <div className="footer__version" key={item.name}>
                <div className="h4-typo footer__version-name">{item.name}</div>
                <div className="body-typo footer__version-value">v{item.version}</div>
              </div>
            ),
          )
        }
      </div>
      <div className="footer__logo-area">
        <div className="footer__icon footer__icon--gen3">
          <a href={'https://cdis.uchicago.edu/gen3'} target="_blank" rel="noopener noreferrer"> {/* fixes security risk */}
            <IconComponent dictIcons={dictIcons} iconName="gen3" height="37px" />
          </a>
        </div>
        <div className="footer__icon footer__icon--uchicago">
          <a href={'https://cdis.uchicago.edu/'} target="_blank" rel="noopener noreferrer"> {/* fixes security risk */}
            <IconComponent dictIcons={dictIcons} iconName="uchicago" height="37px" svgStyles={{ fill: '#ffffff' }} />
          </a>
        </div>
      </div>
    </nav>
  </footer>
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
