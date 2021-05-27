import React from 'react';

import Resource from './Resource';
import { config } from '../params';

import './ResourceBrowser.css';

function ResourceBrowser() {
  const settings = config.resourceBrowser;
  if (!settings) {
    return null;
  }

  // TODO use categories
  const resources = settings.resources || [];
  return (
    <div className='resource-browser'>
      <h2 className='resource-browser__title'>{settings.title}</h2>
      {settings.description && (
        <p className='resource-browser__description'>{settings.description}</p>
      )}
      <div className='resource-browser__resources'>
        {resources.map((resource, i) => (
          <Resource key={i} {...resource} />
        ))}
      </div>
    </div>
  );
}

export default ResourceBrowser;
