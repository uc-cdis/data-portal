import React from 'react';
import parse from 'html-react-parser';

import Resource from './Resource';
import { config } from '../params';

import './ResourceBrowser.css';

class ResourceBrowser extends React.Component {
  render() {
    const settings = config.resourceBrowser;
    if (!settings) {
      return <div />;
    }

    // TODO use categories
    const resources = settings.resources || [];
    return (
      <div className='resource-browser'>
        <h2 className='resource-browser__title'>
          {settings.title}
        </h2>
        {settings.description
          ? (
            <p className='resource-browser__description'>
              {parse(settings.description)}
            </p>
          )
          : null}
        <div className='resource-browser__resources'>
          {resources.map((resource, i) => (
            <Resource
              key={i}
              {...resource}
            />
          ),
          )}
        </div>
      </div>
    );
  }
}

export default ResourceBrowser;
