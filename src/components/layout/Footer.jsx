import React from 'react';
import PropTypes from 'prop-types';
import { portalVersion } from '../../versions';
import './Footer.less';

class Footer extends React.Component {
  render() {
    return (
      <footer className='footer'>
        <nav className='footer__nav'>
          <div className='footer__version-area'>
            {
              [{ name: 'Dictionary', version: this.props.dictionaryVersion },
                { name: 'Submission', version: this.props.apiVersion },
                { name: 'Portal', version: portalVersion }].map(
                item => (
                  <div className='footer__version' key={item.name}>
                    <div className='h4-typo footer__version-name'>{item.name}</div>
                    <div className='body-typo footer__version-value'>v{item.version}</div>
                  </div>
                ),
              )
            }
          </div>
          <div className='footer__logo-area'>
            {
              this.props.logos.map((logoObj, i) => (
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
              ))
            }
          </div>
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

Footer.propTypes = {
  dictionaryVersion: PropTypes.string,
  apiVersion: PropTypes.string,
  logos: PropTypes.arrayOf(LogoObject).isRequired,
};

Footer.defaultProps = {
  dictionaryVersion: 'Unknown',
  apiVersion: 'Unknown',
};

export default Footer;
