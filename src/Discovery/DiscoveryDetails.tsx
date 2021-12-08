import React from 'react';
import {
  Alert, Button, Drawer, Space, Collapse, List,
} from 'antd';
import {
  LinkOutlined,
  CheckOutlined,
  UnlockOutlined,
  DoubleLeftOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { hostname, fenceDownloadPath } from '../localconf';
import { DiscoveryConfig } from './DiscoveryConfig';
import { AccessLevel, accessibleFieldName, renderFieldContent } from './Discovery';

const { Panel } = Collapse;

interface Props {
  modalVisible: boolean;
  setModalVisible: (boolean) => void;
  setPermalinkCopied: (boolean) => void;
  modalData: any;
  config: DiscoveryConfig;
  permalinkCopied: boolean;
}

interface ListItem {
  title: string,
  description: string,
  guid: string
}

const DiscoveryDetails = (props: Props) => (
  <Drawer
    className='discovery-modal'
    visible={props.modalVisible}
    width={'50vw'}
    closable={false}
    onClose={() => props.setModalVisible(false)}
  >
    <div className='discovery-modal__header-buttons'>
      <Button
        type='text'
        onClick={() => props.setModalVisible(false)}
        className='discovery-modal__close-button'
      >
        <DoubleLeftOutlined />
          Back
      </Button>
      <Button
        type='text'
        onClick={() => {
          navigator.clipboard.writeText(`${hostname}discovery/${encodeURIComponent(props.modalData[props.config.minimalFieldMapping.uid])}/`)
            .then(() => {
              props.setPermalinkCopied(true);
            });
        }}
      >
        { props.permalinkCopied
          ? <React.Fragment><CheckOutlined /> Copied! </React.Fragment>
          : <React.Fragment><LinkOutlined /> Permalink </React.Fragment>}
      </Button>
    </div>
    <div className='discovery-modal-content'>
      { props.config.studyPageFields.header
          && (
            <Space align='baseline'>
              <h3 className='discovery-modal__header-text'>{props.modalData[props.config.studyPageFields.header.field]}</h3>
            </Space>
          )}
      { (
        props.config.features.authorization.enabled
            && props.modalData[accessibleFieldName] !== AccessLevel.NOT_AVAILABLE
            && props.modalData[accessibleFieldName] !== AccessLevel.PENDING
      )
          && (props.modalData[accessibleFieldName] === AccessLevel.ACCESSIBLE
            ? (
              <Alert
                className='discovery-modal__access-alert'
                type='success'
                message={<React.Fragment><UnlockOutlined /> You have access to this study.</React.Fragment>}
              />
            )
            : (
              <Alert
                className='discovery-modal__access-alert'
                type='warning'
                message={<React.Fragment>You do not have access to this study.</React.Fragment>}
              />
            )
          )}
      <div className='discovery-modal-attributes-container'>
        { props.config.studyPageFields.fieldsToShow.map((fieldGroup, i) => {
          let groupWidth;
          switch (fieldGroup.groupWidth) {
          case 'full':
            groupWidth = 'fullwidth';
            break;
          case 'half':
          default:
            groupWidth = 'halfwidth';
            break;
          }
          return (
            <div key={i} className={`discovery-modal__attribute-group discovery-modal__attribute-group--${groupWidth}`}>
              { fieldGroup.includeName
                  && <h3 className='discovery-modal__attribute-group-name'>{fieldGroup.groupName}</h3>}
              { fieldGroup.fields.map((field) => {
              // display nothing if selected study doesn't have this field
              // and this field isn't configured to show a default value
                if (!props.modalData[field.field] && !field.includeIfNotAvailable) {
                  return null;
                }
                // If the field contains a particularly long string, add some special styles
                const MULTILINE_FIELD_CHARLIMIT = 200;
                const multiline = props.modalData[field.field]
                  && props.modalData[field.field].length > MULTILINE_FIELD_CHARLIMIT;
                return (
                  <div key={field.name} className='discovery-modal__attribute'>
                    { field.includeName !== false
                        && <span className='discovery-modal__attribute-name'>{field.name}</span>}
                    <span className={`discovery-modal__attribute-value ${multiline ? 'discovery-modal__attribute-value--multiline' : ''}`}>
                      { props.modalData[field.field]
                        ? renderFieldContent(props.modalData[field.field], field.contentType, props.config)
                        : (field.valueIfNotAvailable || 'Not available')}
                    </span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      { (props.config.studyPageFields.downloadLinks && props.config.studyPageFields.downloadLinks.field
        && props.modalData[props.config.studyPageFields.downloadLinks.field])
        ? (
          <Collapse className='discovery-modal__download-panel' defaultActiveKey={['1']}>
            <Panel
              className='discovery-modal__download-panel-header'
              header={props.config.studyPageFields.downloadLinks.name || 'Data Download Links'}
              key='1'
            >
              <List
                itemLayout='horizontal'
                dataSource={props.modalData[props.config.studyPageFields.downloadLinks.field]}
                renderItem={(item:ListItem) => (
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
                      </Button>]}
                  >
                    <List.Item.Meta
                      title={<div className='discovery-modal__download-list-title'>{item.title}</div>}
                      description={<div className='discovery-modal__download-list-description'>{item.description || ''}</div>}
                    />
                  </List.Item>
                )}
              />
            </Panel>
          </Collapse>
        )
        : null}
    </div>
  </Drawer>
);

export default DiscoveryDetails;
