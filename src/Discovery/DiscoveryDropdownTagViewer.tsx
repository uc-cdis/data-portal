import React, { useState } from 'react';
import {
  Select, Button, Row, Col,
} from 'antd';
import { DiscoveryConfig } from './DiscoveryConfig';

const { Option } = Select;

interface DiscoveryTagViewerProps {
  config: DiscoveryConfig
  studies?: {__accessible: boolean, [any: string]: any}[]
  selectedTags: any
  setSelectedTags: any
}

const DiscoveryDropdownTagViewer: React.FunctionComponent<DiscoveryTagViewerProps> = (props: DiscoveryTagViewerProps) => {
  // getTagsInCategory returns a list of the unique tags in studies which belong
  // to the specified category.
  const getTagsInCategory = (category: any, studies: any[] | null):React.ReactNode => {
    if (!studies) {
      return <React.Fragment />;
    }
    const tagMap = {};
    studies.forEach((study) => {
      const tagField = props.config.minimalFieldMapping.tagsListFieldName;
      study[tagField].forEach((tag) => {
        if (tag.category === category.name) {
          if (tagMap[tag.name] === undefined) {
            tagMap[tag.name] = 1;
          }
          tagMap[tag.name] += 1;
        }
      });
    });
    const tagArray = Object.keys(tagMap).sort((a, b) => tagMap[b] - tagMap[a]);

    return (
      <Select
        mode='tags'
        id={`discovery-tag-column--${category.name}`}
        className='discovery-header__tag-column discovery-tag-column'
      >
        { tagArray.map((tag) => (
          <Option
            key={category.name + tag}
            value={tag}
          >
            {tag}
          </Option>
        ),
        )}
      </Select>
    );
  };

  return (
    <div className='discovery-header__tags-container' id='discovery-tag-filters'>
      {props.config.tagSelector.title
      && <h3 className='discovery-header__tags-header'>{props.config.tagSelector.title}</h3>}
      <Row
        gutter={{
          xs: 8, sm: 16, md: 24, lg: 32,
        }}
        justify='space-between'
      >
        {
          props.config.tagCategories.map((category) => {
            if (category.display === false) {
              return null;
            }
            const tags = getTagsInCategory(category, props.studies);

            let categoryDisplayName = category.displayName;
            if (!categoryDisplayName) {
            // Capitalize category name
              const categoryWords = category.name.split('_').map((x) => x.toLowerCase());
              categoryWords[0] = categoryWords[0].charAt(0).toUpperCase()
                + categoryWords[0].slice(1);
              categoryDisplayName = categoryWords.join(' ');
            }

            return (
              <Col
                className='discovery-header__tag-group'
                key={category.name}
                xs={24}
                sm={24}
                md={12}
                lg={6}
                xl={6}
                xxl={4}
              >
                <h5 className='discovery-header__tag-group-header'>{categoryDisplayName}</h5>
                { tags }
              </Col>
            );
          })
        }
      </Row>
    </div>
  );
};

DiscoveryDropdownTagViewer.defaultProps = {
  studies: null,
};

export default DiscoveryDropdownTagViewer;
