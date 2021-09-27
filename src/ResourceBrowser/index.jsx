import React from 'react';
import Resource from './Resource';
import { config } from '../params';
import './ResourceBrowser.css';

/**
 * @typedef {Object} ResourceData
 * @property {string} [description]
 * @property {string} [imageUrl]
 * @property {string} link
 * @property {string} title
 */

const { resourceBrowser } = config;

function ResourceBrowser() {
  if (!resourceBrowser) return null;

  /** @type {{ title: string; description?: string; resources?: ResourceData[] }} */
  const { title, description, resources } = resourceBrowser;
  return (
    <div className='resource-browser'>
      <h2 className='resource-browser__title'>{title}</h2>
      {description && (
        <p className='resource-browser__description'>{description}</p>
      )}
      <div className='resource-browser__resources'>
        {(resources ?? []).map((resource, i) => (
          <Resource key={i} {...resource} />
        ))}
      </div>
    </div>
  );
}

export default ResourceBrowser;
