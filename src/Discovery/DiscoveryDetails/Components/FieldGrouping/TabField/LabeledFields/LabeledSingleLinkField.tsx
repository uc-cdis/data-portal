import React from 'react';
import { LinkItem } from '../../../../DiscoveryDetailsInterfaces';
import { getFieldClassName, label } from './LabelingUtils';

const LabeledSingleLinkField = (
  labelText: string,
  linkObject: LinkItem | string,
) => {
  if (typeof linkObject === 'string') {
    return (
      <div className={getFieldClassName(labelText)}>
        {label(labelText)}
        <a href={linkObject} target='_blank' rel='noreferrer'>
          {linkObject}
        </a>
      </div>
    );
  }
  return (
    <div className={getFieldClassName(labelText)}>
      {label(labelText)}
      <a href={linkObject.link} target='_blank' rel='noreferrer'>
        {linkObject.title || linkObject.link}
      </a>
    </div>
  );
};
export default LabeledSingleLinkField;
