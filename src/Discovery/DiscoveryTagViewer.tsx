import React, { useState } from 'react';
import {
  Tag, Button, Row, Col,
} from 'antd';
import { DiscoveryConfig } from './DiscoveryConfig';
import { DiscoveryResource } from './Discovery';
import Tooltip from 'rc-tooltip';
import { InfoCircleOutlined } from '@ant-design/icons'

const TAG_LIST_LIMIT = 8;
interface DiscoveryTagViewerProps {
  config: DiscoveryConfig
  studies?: DiscoveryResource[]
  selectedTags: any
  setSelectedTags: any
}

const DiscoveryTagViewer: React.FunctionComponent<DiscoveryTagViewerProps> = (props: DiscoveryTagViewerProps) => {
  const [tagsColumnExpansionStatus, setTagsColumnExpansionStatus] = useState({});

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
          tagMap[tag.name] = 1;
        }
      });
    });
    const tagArray = Object.keys(tagMap).sort((a, b) => a.localeCompare(b));

    return (
      <div>
        <div
          id={`discovery-tag-column--${category.name}`}
          className={`discovery-header__tag-column ${(tagsColumnExpansionStatus[category.name]) ? 'discovery-tag-column--expanded' : 'discovery-tag-column'}`}
        >
          { tagArray.map((tag) => (
            <Tag
              key={category.name + tag}
              role='button'
              tabIndex={0}
              aria-pressed={props.selectedTags[tag] ? 'true' : 'false'}
              className={`discovery-header__tag-btn discovery-tag ${(props.selectedTags[tag]) ? 'discovery-tag--selected' : ''}`}
              aria-label={tag}
              style={{
                backgroundColor: props.selectedTags[tag] ? category.color : 'initial',
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
        {(tagArray.length > TAG_LIST_LIMIT)
          ? (
            <Button
              type='link'
              onClick={() => {
                const tagColumn = document.getElementById(`discovery-tag-column--${category.name}`);
                if (tagColumn) {
                  tagColumn.scrollTop = 0;
                }
                setTagsColumnExpansionStatus({
                  ...tagsColumnExpansionStatus,
                  [category.name]: !tagsColumnExpansionStatus[category.name],
                });
              }}
              onKeyPress={() => {
                const tagColumn = document.getElementById(`discovery-tag-column--${category.name}`);
                if (tagColumn) {
                  tagColumn.scrollTop = 0;
                }
                setTagsColumnExpansionStatus({
                  ...tagsColumnExpansionStatus,
                  [category.name]: !tagsColumnExpansionStatus[category.name],
                });
              }}
            >
              {`${(tagsColumnExpansionStatus[category.name]) ? 'Hide' : 'Show'} ${tagArray.length - TAG_LIST_LIMIT} more tags`}
            </Button>
          )
          : null}
      </div>
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
                <table>
                <tr>

                  <td>
                  <Col>
                  <div style={{ display: category.tooltip != null ? 'block' : 'none' }}>
                  <Tooltip
                  placement='left'
                  overlay={category.tooltip}
                  overlayClassName='g3-filter-section__and-or-toggle-helper-tooltip'
                 arrowContent={<div className='rc-tooltip-arrow-inner' />}
                  width='100%'
                  trigger={['hover', 'focus']}
                  id={'controlPanelTooltipAdditional_data'}
                >
                  <span
                    role='button'
                    aria-describedby={'controlPanelTooltipAdditional_data'}
                    className={'g3-helper-tooltip'}
                  >
                    <InfoCircleOutlined/>
                  </span>
                </Tooltip>
                  </div>
                  </Col>
                  </td>
                  <td width='100%'>
                  <h5 className='discovery-header__tag-group-header'>{categoryDisplayName}</h5>
                  {tags}
                  </td>
                </tr>
               </table>
               </Col>
          );
        })
      }
      </Row>
    </div>
  );
};

DiscoveryTagViewer.defaultProps = {
  studies: null,
};

export default DiscoveryTagViewer;
