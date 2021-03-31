import React from 'react';
import PropTypes from 'prop-types';

import './ResourceBrowser.css';

class Resource extends React.Component {
  render() {
    return (
      <div className='resource'>
        <a
          className='resource__link'
          href={this.props.link}
          target='_blank' // open in new tab
          rel='noopener noreferrer'
        >
          <div className='resource__text-contents'>
            <h3 className='resource__title'>
              {this.props.title}
            </h3>
            {this.props.description
              ? (
                <div className='resource__description'>
                  {this.props.description}
                </div>
              )
              : null}
          </div>
          {this.props.imageUrl
            ? (
              <img
                className='resource__image'
                src={this.props.imageUrl}
                alt={this.props.title}
              />
            )
            : null}
        </a>
      </div>
    );
  }
}

Resource.propTypes = {
  title: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  description: PropTypes.string,
  imageUrl: PropTypes.string,
};

Resource.defaultProps = {
  description: '',
  imageUrl: '',
};

export default Resource;
