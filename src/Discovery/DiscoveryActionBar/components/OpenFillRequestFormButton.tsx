import React from 'react';
import { FileTextOutlined } from '@ant-design/icons';
import { Popover, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const OpenFillRequestFormButton = (props) => {
  if (
    !props.config.features.exportToWorkspace?.enableFillRequestForm ||
    !props.config.features.exportToWorkspace.fillRequestFormURL?.trim() ||
    !props.config.features.exportToWorkspace.externalWebsiteURL?.trim() ||
    !props.config.features.exportToWorkspace.externalWebsiteName?.trim()
  ) {
    return null; 
  }

  return (
    <Popover
      className='discovery-popover'
      arrowPointAtCenter
      title={(
        <React.Fragment>
          &nbsp;
          <a
            target='_blank'
            rel='noreferrer'
            href={props.config.features.exportToWorkspace.externalWebsiteURL}
          >
            {props.config.features.exportToWorkspace.externalWebsiteName}
          </a>
          <FontAwesomeIcon icon={'external-link-alt'} />
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
        onClick={() => {
          const combinedIds = props.discovery.selectedResources.map((item) => item._medical_sample_id).join(',');
          const url = `${props.config.features.exportToWorkspace.fillRequestFormURL}?query=${encodeURIComponent(combinedIds)}`;
          window.open(url, '_blank');
        }}
        type='default'
        className={`discovery-action-bar-button${(props.discovery.selectedResources.length === 0) ? '--disabled' : ''}`}
        disabled={
          props.discovery.selectedResources.length === 0 ||
          !props.config.features.exportToWorkspace.fillRequestFormURL ||
          props.discovery.selectedResources.map((item) => item._medical_sample_id).join(',').length === 0
        }
        icon={<FileTextOutlined />}
      >
        {`Click Here to ${props.config.features.exportToWorkspace.fillRequestFormDisplayText || 'Request Information'}`}
      </Button>
    </Popover>
  );
};

export default OpenFillRequestFormButton;
