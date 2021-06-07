import React from 'react';
import PropTypes from 'prop-types';
import { Tag } from 'antd';
import { DiscoveryConfig } from './DiscoveryConfig';

// getTagsInCategory returns a list of the unique tags in studies which belong
// to the specified category.
const getTagsInCategory =
  (category: string, studies: any[] | null, config: DiscoveryConfig): string[] => {
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

class DiscoveryTagViewer extends React.Component {
  render() {
    return (
      <div className='discovery-header__tags-container' >
        <h3 className='discovery-header__tags-header'>{this.props.config.tagSelector.title}</h3>
        <div className='discovery-header__tags'>
          {
            this.props.config.tagCategories.map((category) => {
              if (category.display === false) {
                return null;
              }
              const tags = getTagsInCategory(category.name, this.props.studies, this.props.config);

              // Capitalize category name
              const categoryWords = category.name.split('_').map(x => x.toLowerCase());
              categoryWords[0] = categoryWords[0].charAt(0).toUpperCase() +
                categoryWords[0].slice(1);
              const capitalizedCategoryName = categoryWords.join(' ');

              let tagsClone = [...tags];
              tagsClone.sort((a, b) => a.length - b.length);
              const uniqueTags = new Set(tagsClone);
              tagsClone = [...uniqueTags];

              return (<div className='discovery-header__tag-group' key={category.name}>
                <h5 className='discovery-header__tag-group-header' >{capitalizedCategoryName}</h5>
                { tagsClone.map(tag =>
                  (<Tag
                    key={category.name + tag}
                    role='button'
                    tabIndex={0}
                    aria-pressed={this.props.selectedTags[tag] ? 'true' : 'false'}
                    className={`discovery-header__tag-btn discovery-tag ${this.props.selectedTags[tag] && 'discovery-tag--selected'}`}
                    aria-label={tag}
                    style={{
                      backgroundColor: this.props.selectedTags[tag] ? category.color : 'white',
                      borderColor: category.color,
                    }}
                    onKeyPress={() => {
                      this.props.setSelectedTags({
                        ...this.props.selectedTags,
                        [tag]: this.props.selectedTags[tag] ? undefined : true,
                      });
                    }}
                    onClick={() => {
                      this.props.setSelectedTags({
                        ...this.props.selectedTags,
                        [tag]: this.props.selectedTags[tag] ? undefined : true,
                      });
                    }}
                  >
                    {tag}
                  </Tag>),
                )}
              </div>);
            })
          }
        </div>
      </div>
    );
  }
}

DiscoveryTagViewer.propTypes = {
  config: PropTypes.object,
  studies: PropTypes.any,
  selectedTags: PropTypes.any,
  setSelectedTags: PropTypes.any,
};

DiscoveryTagViewer.defaultProps = {
  config: {},
  studies: null,
  selectedTags: null,
  setSelectedTags: null,
};

export default DiscoveryTagViewer;
