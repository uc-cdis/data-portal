import React from 'react';
import {
  Alert, Button, Drawer, Space, Collapse, List, Tabs
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
import {
  AccessLevel, accessibleFieldName, renderFieldContent, DiscoveryResource,
} from './Discovery';

const { Panel } = Collapse;

interface Props {
  modalVisible: boolean;
  setModalVisible: (boolean) => void;
  setPermalinkCopied: (boolean) => void;
  modalData: DiscoveryResource;
  config: DiscoveryConfig;
  permalinkCopied: boolean;
}

interface ListItem {
  title: string,
  description: string,
  guid: string
}

const fieldCls = { className: 'discovery-modal__field' };
const subHeadingCls = { className: 'discovery-modal__subheading' };
const fieldGroupingClass = { className: 'discovery-modal__fieldgroup' };
const labelCls = { className: 'discovery-modal__fieldlabel' };
const tagsCls = { className: 'discovery-modal__tagsfield' };
const tabLabelCls = { className: 'discovery-modal__tablabel' }

const blockTextField = (text: string) => <div {...fieldCls}>{text}</div>;
const label = (text: string) => <b {...labelCls}>{text}</b>;
const textField = (text: string) => <span>{text}</span>;
const linkField = (text: string) => <a href={text} target='_blank' rel='noreferrer'>{text}</a>;

const subHeading = (text: string) => <h3 {...subHeadingCls}>{text}</h3>;
const labeledSingleTextField = (labelText: string, fieldText: string) => <div {...fieldCls}>{label(labelText)} {textField(fieldText)}</div>;
const labeledMultipleTextField = (labelText: string, fieldsText: string[]) => (
  fieldsText.length
    ? (
      <div>
        {
          [
            // labeled first field
            <div {...fieldCls}>{label(labelText)} {textField(fieldsText[0])}</div>,
            // unlabeled subsequent fields
            ...fieldsText.slice(1).map(
              (text, i) => <div {...fieldCls} key={i}><div /> {textField(text)}</div>,
            ),
          ]
        }
      </div>
    )
    : <React.Fragment />
);
const labeledSingleLinkField = (labelText: string, linkText: string) => <div {...fieldCls}>{label(labelText)} {linkField(linkText)}</div>;
const labeledMultipleLinkField = (labelText: string, linksText: string[]) => (
  linksText.length
    ? (
      <div>
        {
          [
            // labeled first field
            <div {...fieldCls}>{label(labelText)} {linkField(linksText[0])}</div>,
            // unlabeled subsequent fields
            ...linksText.slice(1).map(
              (linkText, i) => <div {...fieldCls} key={i}><div /> {linkField(linkText)}</div>,
            ),
          ]
        }
      </div>
    )
    : <React.Fragment />
);

const accessDescriptor = (resource: DiscoveryResource) => {
  if (resource[accessibleFieldName] === AccessLevel.ACCESSIBLE) {
    return (
      <Alert
        className='discovery-modal__access-alert'
        type='success'
        message={<React.Fragment><UnlockOutlined /> You have access to this study.</React.Fragment>}
      />
    );
  }
  if (resource[accessibleFieldName] === AccessLevel.UNACCESSIBLE) {
    return (
      <Alert
        className='discovery-modal__access-alert'
        type='warning'
        message={<React.Fragment>You do not have access to this study.</React.Fragment>}
      />
    );
  }
  return (
    <Alert
      className='discovery-modal__access-alert'
      type='info'
      message={<React.Fragment>This study does not include data access authorization details.</React.Fragment>}
    />
  );
};

type TabFieldConfig = TabFieldGroup['fields'][0]
type TabFieldGroup = DiscoveryConfig['detailView']['tabs'][0]['groups'][0];

const tabField = (fieldConfig: TabFieldConfig, discoveryConfig: DiscoveryConfig, resource: DiscoveryResource): JSX.Element => {
  const resourceFieldValue = fieldConfig.sourceField && resource[fieldConfig.sourceField];
  if (resourceFieldValue) {
    if (fieldConfig.type === 'text') {
      return labeledSingleTextField(fieldConfig.label, resourceFieldValue);
    }
    if (fieldConfig.type === 'link') {
      return labeledSingleLinkField(fieldConfig.label, resourceFieldValue);
    }
    if (fieldConfig.type === 'textList') {
      return labeledMultipleTextField(fieldConfig.label, resourceFieldValue);
    }
    if (fieldConfig.type === 'linkList') {
      return labeledMultipleLinkField(fieldConfig.label, resourceFieldValue);
    }
    if (fieldConfig.type === 'block') {
      return blockTextField(resourceFieldValue);
    }
  } else {
    if (fieldConfig.type === 'accessDescriptor') {
      return accessDescriptor(resource);
    }
    if (fieldConfig.type === 'tags') {
      const tags = fieldConfig.categories ? (resource.tags || []).filter(
        (tag) => fieldConfig.categories.includes(tag.category),
      ) : resource.tags;
      return <div {...tagsCls}>{renderFieldContent(tags, 'tags', discoveryConfig)}</div>;
    }
  }
  return <React.Fragment />;
};

const fieldGrouping = (group: TabFieldGroup, discoveryConfig: DiscoveryConfig, resource: DiscoveryResource) => {
  // at least one field from this group is either populated in the resource, or isn't configured to pull from a field (e.g. tags)
  const groupHasContent = group.fields.some(
    (field) => !field.sourceField || resource[field.sourceField],
  );
  if (groupHasContent) {
    return (
      <div {...fieldGroupingClass}>
        {group.header ? subHeading(group.header) : null}
        {
          group.fields.map(
            (field, i) => <div key={i}>{tabField(field, discoveryConfig, resource)}</div>,
          )
        }
      </div>
    );
  }

  return <React.Fragment />;
};

const DiscoveryDetails = (props: Props) => {
  const headerField = props.config.detailView?.headerField || props.config.studyPageFields.header?.field;
  const header = (
    <Space align='baseline'>
      <h3 className='discovery-modal__header-text'>{props.modalData[headerField]}</h3>
    </Space>
  );

  return (
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
      {
        props.config.detailView?.tabs
          ? (
            <div className='discovery-modal-content'>
              {header}
              <Tabs type={'card'}>
                {
                  props.config.detailView.tabs.map(
                    ({ tabName, groups }) => (
                      <Tabs.TabPane key={tabName} tab={<span {...tabLabelCls}>{tabName}</span>}>
                        {
                          (groups || []).map(
                            (group, i) => <div key={i}>{fieldGrouping(group, props.config, props.modalData)}</div>,
                          )
                        }
                      </Tabs.TabPane>
                    ),
                  )
                }
              </Tabs>
            </div>
          )
          : (
            <React.Fragment>

              <div className='discovery-modal-content'>
                {header}
                {(
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
            </React.Fragment>
          )
      }

    </Drawer>
  );
};

export default DiscoveryDetails;
