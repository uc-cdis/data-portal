import React from 'react';
import { Alert, Button, Drawer, Space } from 'antd';
import {
  LockFilled,
  LinkOutlined,
  CheckOutlined,
  UnlockOutlined,
  DoubleLeftOutlined,
} from '@ant-design/icons';
import { hostname } from '../localconf';
import { DiscoveryConfig } from './DiscoveryConfig';
import { AccessLevel, accessibleFieldName, renderFieldContent } from './Discovery';

interface Props {
  modalVisible: boolean;
  setModalVisible: (boolean) => void;
  setPermalinkCopied: (boolean) => void;
  modalData: any;
  config: DiscoveryConfig;
  permalinkCopied: boolean;
}

const DiscoveryDetails = (props: Props) => {
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
            navigator.clipboard.writeText(`${hostname}discovery/${props.modalData[props.config.minimalFieldMapping.uid]}/`)
              .then(() => {
                props.setPermalinkCopied(true);
              });
          }}
        >
          { props.permalinkCopied
            ? <><CheckOutlined /> Copied! </>
            : <><LinkOutlined /> Permalink </>
          }
        </Button>
      </div>
      <div className='discovery-modal-content'>
        { props.config.studyPageFields.header &&
          <Space align='baseline'>
            <h3 className='discovery-modal__header-text'>{props.modalData[props.config.studyPageFields.header.field]}</h3>
          </Space>
        }
        { (
          props.config.features.authorization.enabled
            && props.modalData[accessibleFieldName] !== AccessLevel.NOTAVAILABLE
        ) &&
          (props.modalData[accessibleFieldName] === AccessLevel.ACCESSIBLE
            ? (
              <Alert
                className='discovery-modal__access-alert'
                type='success'
                message={<><UnlockOutlined /> You have access to this study.</>}
              />
            )
            : (
              <Alert
                className='discovery-modal__access-alert'
                type='warning'
                message={<><LockFilled /> You do not have access to this study.</>}
              />
            )
          )
        }
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
            return (<div key={i} className={`discovery-modal__attribute-group discovery-modal__attribute-group--${groupWidth}`}>
              { fieldGroup.includeName &&
                  <h3 className='discovery-modal__attribute-group-name'>{fieldGroup.groupName}</h3>
              }
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
                    { field.includeName !== false &&
                        <span className='discovery-modal__attribute-name'>{field.name}</span>
                    }
                    <span className={`discovery-modal__attribute-value ${multiline ? 'discovery-modal__attribute-value--multiline' : ''}`}>
                      { props.modalData[field.field]
                        ? renderFieldContent(props.modalData[field.field], field.contentType, props.config)
                        : (field.valueIfNotAvailable || 'Not available')
                      }
                    </span>
                  </div>
                );
              })}
            </div>);
          })}
        </div>
      </div>
    </Drawer>
  );
};

export default DiscoveryDetails;
