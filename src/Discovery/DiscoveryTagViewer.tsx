import React from 'react';
import { Tag } from 'antd';
import { DiscoveryConfig } from './DiscoveryConfig';

// getTagsInCategory returns a list of the unique tags in studies which belong
// to the specified category.
const getTagsInCategory = (category: string, studies: any[] | null, config: DiscoveryConfig): string[] => {
  if (!studies) {
    return [];
  }
  const tagMap = {};
  studies.forEach((study) => {
    const tagField = config.minimalFieldMapping.tagsListFieldName;
    study[tagField].forEach((tag) => {
      if (tag.category === category) {
        tagMap[tag.name] = true;
      }
    });
  });
  return Object.keys(tagMap);
};

interface DiscoveryTagViewerProps {
  config: DiscoveryConfig
  studies?: {__accessible: boolean, [any: string]: any}[]
  selectedTags: any
  setSelectedTags: any
}

const DiscoveryTagViewer: React.FunctionComponent<DiscoveryTagViewerProps> = (props: DiscoveryTagViewerProps) => (
  <div className='discovery-header__tags-container' id='discovery-tag-filters'>
    <h3 className='discovery-header__tags-header'>{props.config.tagSelector.title}</h3>
    <div className='discovery-header__tags'>
      {
        props.config.tagCategories.map((category) => {
          if (category.display === false) {
            return null;
          }
          const tags = getTagsInCategory(category.name, props.studies, props.config);

          // Capitalize category name
          const categoryWords = category.name.split('_').map((x) => x.toLowerCase());
          categoryWords[0] = categoryWords[0].charAt(0).toUpperCase()
                + categoryWords[0].slice(1);
          const capitalizedCategoryName = categoryWords.join(' ');

          let tagsClone = [...tags];
          tagsClone.sort((a, b) => a.length - b.length);
          const uniqueTags = new Set(tagsClone);
          tagsClone = [...uniqueTags];

          return (
            <div className='discovery-header__tag-group' key={category.name}>
              <h5 className='discovery-header__tag-group-header'>{capitalizedCategoryName}</h5>
              { tagsClone.map((tag) => (
                <Tag
                  key={category.name + tag}
                  role='button'
                  tabIndex={0}
                  aria-pressed={props.selectedTags[tag] ? 'true' : 'false'}
                  className={`discovery-header__tag-btn discovery-tag ${props.selectedTags[tag] && 'discovery-tag--selected'}`}
                  aria-label={tag}
                  style={{
                    backgroundColor: props.selectedTags[tag] ? category.color : 'white',
                    borderColor: category.color,
                  }}
                  onKeyPress={() => {
                    props.setSelectedTags({
                      ...props.selectedTags,
                      [tag]: props.selectedTags[tag] ? undefined : true,
                    });
                  }}
                  onClick={() => {
                    props.setSelectedTags({
                      ...props.selectedTags,
                      [tag]: props.selectedTags[tag] ? undefined : true,
                    });
                  }}
                >
                  {tag}
                </Tag>
              ),
              )}
            </div>
          );
        })
      }
    </div>
  </div>
);

DiscoveryTagViewer.defaultProps = {
  studies: null,
};

export default DiscoveryTagViewer;
