import React from 'react';

import Resource from './Resource';
import { config } from '../params';

import './ResourceBrowser.css';

class ResourceBrowser extends React.Component {
  render() {
    // TODO use categories
    const title = config.resourceBrowser.title;
    const resources = (config.resourceBrowser && config.resourceBrowser.resources) || [];
    return (
      <div className='resource-browser'>
        <h2 className='resource-browser__title'>
          {title}
        </h2>
        <div className='resource-browser__resources'>
          {resources.map((resource, i) =>
            (<Resource
              key={i}
              {...resource}
            />),
          )}
        </div>
      </div>
    );
  }
}

export default ResourceBrowser;
