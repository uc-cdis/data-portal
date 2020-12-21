import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Footer.css';

class Footer extends Component {
  render() {
    return (
      <div className='g3-footer'>
        {
          this.props.logoSrc
          && (
            <img
              className='g3-footer__image'
              src={this.props.logoSrc}
              alt='gen3 footer'
            />
          )
        }
      </div>
    );
  }
}

Footer.propTypes = {
  logoSrc: PropTypes.string,
};

Footer.defaultProps = {
  logoSrc: null,
};

export default Footer;
