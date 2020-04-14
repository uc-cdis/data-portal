import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import './ResourceBrowser.css';

class Resource extends React.Component {
  render() {
    return (
      <a
        className='resource resource__link'
        href={this.props.link}
        target="_blank" // open in new tab
      >
        <h3 className='resource__title'>
          {this.props.title}
        </h3>
        {this.props.description ?
          <div className='resource__description'>
            {this.props.description}
          </div>
        : null}
        {this.props.imageUrl ?
          <img
            className='resource__image'
            src={this.props.imageUrl} // TODO handle if no image
          />
        : null}
      </a>
    )
  }
}

Resource.propTypes = {
  title: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  category: PropTypes.string,
  description: PropTypes.string,
  imageUrl: PropTypes.string,
};

Resource.defaultProps = {
  category: '',
  description: '',
  imageUrl: '',
};


export default Resource;
