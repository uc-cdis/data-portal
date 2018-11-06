import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { portalVersion } from '../../versions';
import './Footer.less';

class Footer extends Component {
  render() {
    if (this.props.hidden) {
      return (<React.Fragment />);
    }
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
            <a
              target='_blank'
              href='https://ctds.uchicago.edu/gen3'
              className='footer__icon'
              rel='noopener noreferrer'
            >
              <img className='footer__img' src='/src/img/gen3.png' alt='Gen3' />
            </a>
            <a
              target='_blank'
              href='https://ctds.uchicago.edu/'
              className='footer__icon'
              rel='noopener noreferrer'
            >
              <img className='footer__img' src='/src/img/createdby.png' alt='Uchicago CTDS' />
            </a>
          </div>
        </nav>
      </footer>
    );
  }
}

Footer.propTypes = {
  dictionaryVersion: PropTypes.string,
  apiVersion: PropTypes.string,
  hidden: PropTypes.bool,
};

Footer.defaultProps = {
  dictionaryVersion: 'Unknown',
  apiVersion: 'Unknown',
  hidden: false,
};

export default Footer;
