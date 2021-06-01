import React from 'react';
import PropTypes from 'prop-types';

import './ResourceBrowser.css';

function Resource({ title, link, description, imageUrl }) {
  return (
    <div className='resource'>
      <a
        className='resource__link'
        href={link}
        target='_blank' // open in new tab
        rel='noopener noreferrer'
      >
        <div className='resource__text-contents'>
          <h3 className='resource__title'>{title}</h3>
          {description && (
            <div className='resource__description'>{description}</div>
          )}
        </div>
        {imageUrl && (
          <img className='resource__image' src={imageUrl} alt={title} />
        )}
      </a>
    </div>
  );
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
