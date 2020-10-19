import React from 'react';
import PropTypes from 'prop-types';
import { useRouteMatch } from 'react-router-dom';
import './Footer.less';

function Footer({
  dictionaryVersion,
  apiVersion,
  portalVersion,
  links,
  logos,
  privacyPolicy,
}) {
  const isFooterHidden = useRouteMatch('/dd');

  return isFooterHidden ? null : (
    <footer className='footer-container'>
      <nav className='footer__nav'>
        <div className='footer__version-area'>
          {[
            { name: 'Dictionary', version: dictionaryVersion },
            { name: 'Submission', version: apiVersion },
            { name: 'Portal', version: portalVersion },
          ].map((item) => (
            <div className='footer__version' key={item.name}>
              <div className='h4-typo footer__version-name'>{item.name}</div>
              <div className='body-typo footer__version-value'>
                v{item.version}
              </div>
            </div>
          ))}
        </div>
        {privacyPolicy && privacyPolicy.text ? (
          <div className='footer__privacy-policy-area'>
            <a
              className='h4-typo footer__privacy-policy'
              href={privacyPolicy.footerHref}
              target='_blank'
              rel='noopener noreferrer'
            >
              {privacyPolicy.text}
            </a>
          </div>
        ) : null}
        <div className='footer__logo-area'>
          {logos.map((logoObj, i) => (
            <a
              key={i}
              target='_blank'
              href={logoObj.href}
              className='footer__icon'
              rel='noopener noreferrer'
            >
              <img
                className='footer__img'
                src={logoObj.src}
                alt={logoObj.alt}
                style={{ height: logoObj.height ? logoObj.height : 60 }}
              />
            </a>
          ))}
        </div>
        <div className='footer__link-area'>
          {links.map((link, i) => (
            <React.Fragment key={link.href}>
              <a
                href={link.href}
                className='footer__link'
                target='_blank'
                rel='noopener noreferrer'
              >
                {link.text ? link.text : link.href}
              </a>
              {i !== links.length - 1 && <span> | </span>}
            </React.Fragment>
          ))}
        </div>
      </nav>
    </footer>
  );
}

const LogoObject = PropTypes.shape({
  src: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  height: PropTypes.number,
});

const FooterLink = PropTypes.shape({
  text: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
});

Footer.propTypes = {
  dictionaryVersion: PropTypes.string,
  apiVersion: PropTypes.string,
  portalVersion: PropTypes.string,
  links: PropTypes.arrayOf(FooterLink),
  logos: PropTypes.arrayOf(LogoObject).isRequired,
  privacyPolicy: PropTypes.shape({
    footerHref: PropTypes.string,
    text: PropTypes.string,
  }),
};

Footer.defaultProps = {
  dictionaryVersion: 'Unknown',
  apiVersion: 'Unknown',
  portalVersion: 'Unknown',
  links: [],
  privacyPolicy: null,
};

export default Footer;
