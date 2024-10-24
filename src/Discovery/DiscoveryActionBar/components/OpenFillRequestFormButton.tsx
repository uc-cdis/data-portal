import React from 'react';
import { FileTextOutlined } from '@ant-design/icons';
import { Popover, Button } from 'antd';

const OpenFillRequestFormButton = ({
    props,
  }) => (
  props.config.features.exportToWorkspace?.enableFillRequestForm && (
    <Popover
      className='discovery-popover'
      arrowPointAtCenter
      title={(
        <React.Fragment>
          &nbsp;
          <a target='_blank' rel='noreferrer' href='https://pandemicresponsecommons.org'>
            {'Pandemic Response Commons Website'}
          </a>.
        </React.Fragment>
      )}
      content={(
        <span className='discovery-popover__text'>
          After filling the request form, after your search selection, you would get an approval after which you can use the Gen3 Client
          to download the data from the selected studies to your local computer.
        </span>
      )}
    >
      <Button
        onClick={props.config.features.exportToWorkspace?.fillRequestFormURL ? () => {
          const combinedIds = props.discovery.selectedResources.map((item)=>(item._medical_sample_id)).join(',');
          const url = `${props.config.features.exportToWorkspace.fillRequestFormURL}?query=${encodeURIComponent(combinedIds)}`;
          window.open(url, '_blank');
        } : () => {
          window.open(props.config.features.exportToWorkspace.fillRequestFormURL, '_blank');
        }}
        type='default'
        className={`discovery-action-bar-button${(props.discovery.selectedResources.length === 0) ? '--disabled' : ''}`}
        disabled={props.discovery.selectedResources.length === 0 || !props.config.features.exportToWorkspace.fillRequestFormURL }
        icon={<FileTextOutlined />}
      >
        {'Click Here to ' + (props.config.features.exportToWorkspace.fillRequestFormDisplayText || 'Request Access')}
      </Button>
    </Popover>
  )
);

export default OpenFillRequestFormButton;
