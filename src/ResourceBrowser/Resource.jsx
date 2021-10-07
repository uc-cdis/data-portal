import React from 'react';
import PropTypes from 'prop-types';
import './ResourceBrowser.css';

/** @param {import('./index').ResourceData} props */
function Resource({ description = '', imageUrl = '', link, title }) {
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
  description: PropTypes.string,
  imageUrl: PropTypes.string,
  link: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default Resource;
