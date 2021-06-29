import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Footer.less';

class Footer extends Component {
  render() {
    if (this.props.hidden) {
      return (<React.Fragment />);
    }
    return (
      <footer className='footer-container'>
        <nav className='footer__nav'>
          <div className='footer__version-area'>
            {
              [{ name: 'Dictionary', version: this.props.dictionaryVersion },
                { name: 'Submission', version: this.props.apiVersion },
                { name: 'Portal', version: this.props.portalVersion }].map(
                (item) => (
                  <div className='footer__version' key={item.name}>
                    <div className='h4-typo footer__version-name'>{item.name}</div>
                    <div className='body-typo footer__version-value'>v{item.version}</div>
                  </div>
                ),
              )
            }
          </div>
          {this.props.privacyPolicy && this.props.privacyPolicy.text
            ? (
              <div className='footer__privacy-policy-area'>
                <a
                  className='h4-typo footer__privacy-policy'
                  href={this.props.privacyPolicy.footerHref}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  {this.props.privacyPolicy.text}
                </a>
              </div>
            )
            : null}
          <div className='footer__logo-area'>
            {
              this.props.logos.map((logoObj, i) => (
                <a
                  key={i}
                  target='_blank'
                  href={logoObj.href}
                  className='footer__icon g3-ring-on-focus'
                  rel='noopener noreferrer'
                >
                  <img
                    className='footer__img'
                    src={logoObj.src}
                    alt={logoObj.alt}
                    style={{ height: logoObj.height ? logoObj.height : 60 }}
                  />
                </a>
              ))
            }
          </div>
          { (this.props.links.length > 0)
            ? (
              <div className='footer__link-area'>
                {
                  this.props.links.map((link, i) => (
                    <React.Fragment key={link.href}>
                      <a
                        href={link.href}
                        className='footer__link g3-ring-on-focus'
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        {link.text ? link.text : link.href}
                      </a>
                      { i !== this.props.links.length - 1 && <span> | </span> }
                    </React.Fragment>
                  ))
                }
              </div>
            )
            : null}
        </nav>
      </footer>
    );
  }
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
  hidden: PropTypes.bool,
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
  hidden: false,
  portalVersion: 'Unknown',
  links: [],
  privacyPolicy: null,
};

export default Footer;
