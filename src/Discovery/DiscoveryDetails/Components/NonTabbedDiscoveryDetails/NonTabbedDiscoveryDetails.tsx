import React from 'react';
import { Button, Collapse, List } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import jsonpath from 'jsonpath';
import {
  accessibleFieldName,
  renderFieldContent,
} from '../../../Discovery';
import { fenceDownloadPath } from '../../../../localconf';
import { ListItem } from '../../DiscoveryDetailsInterfaces';
import StudyHeader from '../StudyHeader';
import AccessDescriptor from '../AccessDescriptor/AccessDescriptor';

const { Panel } = Collapse;

const NonTabbedDiscoveryDetails = ({ props }) => {
  const showDownloadPanel = props.config.studyPageFields.downloadLinks
    && props.config.studyPageFields.downloadLinks.field
    && props.modalData[props.config.studyPageFields.downloadLinks.field];

  const determineFieldGroupWrapperClassName = (groupWidth: string) => {
    let groupWidthSize: string;
    if (groupWidth === 'full') {
      groupWidthSize = 'fullwidth';
    } else {
      groupWidthSize = 'halfwidth';
    }
    return `discovery-modal__attribute-group discovery-modal__attribute-group--${groupWidthSize}`;
  };

  return (
    <React.Fragment>
      <div className='discovery-modal-content'>
        <StudyHeader props={props} />
        <AccessDescriptor
          accessibleFieldValue={props.modalData[accessibleFieldName]}
        />
        <div className='discovery-modal-attributes-container'>
          {props.config.studyPageFields.fieldsToShow.map(
            (fieldGroup, i: number) => {
              const fieldGroupWrapperClassName = determineFieldGroupWrapperClassName(fieldGroup.groupWidth);
              return (
                <div key={i} className={fieldGroupWrapperClassName}>
                  {fieldGroup.includeName && (
                    <h3 className='discovery-modal__attribute-group-name'>
                      {fieldGroup.groupName}
                    </h3>
                  )}
                  {fieldGroup.fields.map((field) => {
                    const fieldValue = jsonpath.query(
                      props.modalData,
                      `$.${field.field}`,
                    );
                    const isFieldValueEmpty = !fieldValue
                      || fieldValue.length === 0
                      || fieldValue.every((val) => val === '');
                    // display nothing if selected study doesn't have this field
                    // and this field isn't configured to show a default value
                    if (isFieldValueEmpty && !field.includeIfNotAvailable) {
                      return null;
                    }
                    // If the field contains a particularly long string, add some special styles
                    const MULTILINE_FIELD_CHARLIMIT = 200;
                    const multiline = fieldValue[0]
                      && fieldValue[0].length > MULTILINE_FIELD_CHARLIMIT;
                    const renderedFieldContent = (
                      <div
                        key={field.name}
                        className='discovery-modal__attribute'
                      >
                        {field.includeName !== false && (
                          <span className='discovery-modal__attribute-name'>
                            {field.name}
                          </span>
                        )}
                        <span
                          className={`discovery-modal__attribute-value ${
                            multiline
                              ? 'discovery-modal__attribute-value--multiline'
                              : ''
                          }`}
                        >
                          {!isFieldValueEmpty
                            ? renderFieldContent(
                              fieldValue,
                              field.contentType,
                              props.config,
                            )
                            : field.valueIfNotAvailable || 'Not available'}
                        </span>
                      </div>
                    );
                    const linkingField = `${field.field}_link`;
                    if (props.modalData[linkingField] !== undefined) {
                      return (
                        <a
                          key={linkingField}
                          href={props.modalData[linkingField]}
                        >
                          {renderedFieldContent}
                        </a>
                      );
                    }
                    return renderedFieldContent;
                  })}
                </div>
              );
            },
          )}
        </div>
        {showDownloadPanel ? (
          <Collapse
            className='discovery-modal__download-panel'
            defaultActiveKey={['1']}
          >
            <Panel
              className='discovery-modal__download-panel-header'
              header={
                props.config.studyPageFields.downloadLinks.name
                || 'Data Download Links'
              }
              key='1'
            >
              <List
                itemLayout='horizontal'
                dataSource={
                  props.modalData[
                    props.config.studyPageFields.downloadLinks.field
                  ]
                }
                renderItem={(item: ListItem) => (
                  <List.Item
                    actions={[
                      <Button
                        className='discovery-modal__download-button'
                        href={`${fenceDownloadPath}/${item.guid}?expires_in=900&redirect`}
                        target='_blank'
                        type='text'
                        // disable button if data has no GUID
                        disabled={!item.guid}
                        icon={<DownloadOutlined />}
                      >
                        Download File
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      title={(
                        <div className='discovery-modal__download-list-title'>
                          {item.title}
                        </div>
                      )}
                      description={(
                        <div className='discovery-modal__download-list-description'>
                          {item.description || ''}
                        </div>
                      )}
                    />
                  </List.Item>
                )}
              />
            </Panel>
          </Collapse>
        ) : null}
      </div>
    </React.Fragment>
  );
};

export default NonTabbedDiscoveryDetails;
