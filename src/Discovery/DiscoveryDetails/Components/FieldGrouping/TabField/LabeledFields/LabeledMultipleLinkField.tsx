import React from 'react';
import { LinkItem } from '../../../../DiscoveryDetailsInterfaces';
import { getFieldClassName, label } from './LabelingUtils';

const linkField = (text: string, title?: string) => (
  <a href={text} target='_blank' rel='noreferrer'>
    {title || text}
  </a>
);

const LabeledMultipleLinkField = (
  labelText: string,
  links: LinkItem[] | string[],
) => {
  if (!links.length) {
    return null;
  }
  if (typeof links === 'string') {
    return (
      <div className={getFieldClassName(labelText)}>
        {label(labelText)} {linkField(links, links)}
      </div>
    );
  }
  if (typeof links[0] === 'string') {
    return (
      <div>
        {/* labeled first field */}
        <div className={getFieldClassName(labelText)} key='root'>
          {label(labelText)} {linkField(links[0].toString(), links[0].toString())}
        </div>
        {[
          // unlabeled subsequent fields
          ...links.slice(1).map((linkText, i) => (
            <div className={getFieldClassName(labelText)} key={i}>
              <div /> {linkField(linkText)}
            </div>
          )),
        ]}
      </div>
    );
  }
  // if links is an array of objects in the format of { link: aaa, title: bbb }
  return (
    <div>
      {/* labeled first field */}
      <div className={getFieldClassName(labelText)} key='root'>
        {label(labelText)} {linkField(links[0].link, links[0].title)}
      </div>
      {[
        // unlabeled subsequent fields
        ...links.slice(1)?.map((linkObject, i) => (
          <div className={getFieldClassName(labelText)} key={i}>
            {linkField(linkObject.link, linkObject.title)}
          </div>
        )),
      ]}
    </div>
  );
};

export default LabeledMultipleLinkField;
