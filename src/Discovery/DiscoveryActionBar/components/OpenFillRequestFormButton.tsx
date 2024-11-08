import React from 'react';
import { FileTextOutlined } from '@ant-design/icons';
import { Popover, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const OpenFillRequestFormButton = (props) => {
  const { config, discovery } = props.props;

  // Check if Fill Request Form button should be disabled based on configuration
  const isFillRequestFormDisabled = !config?.features?.exportToWorkspace?.enableFillRequestForm
    || !config.features.exportToWorkspace.fillRequestFormURL?.trim()
    || !config.features.exportToWorkspace.externalWebsiteURL?.trim()
    || !config.features.exportToWorkspace.externalWebsiteName?.trim();

  if (isFillRequestFormDisabled) {
    return null; // Return early if any required config values are missing
  }

  // Define URLs and text for use in the popover and button
  const {
    fillRequestFormURL, externalWebsiteURL, externalWebsiteName, fillRequestFormDisplayText,
  } = config.features.exportToWorkspace;
  const { selectedResources } = discovery;

  return (
    <Popover
      className='discovery-popover'
      arrowPointAtCenter
      title={(
        <React.Fragment>
          &nbsp;
          <a target='_blank' rel='noreferrer' href={externalWebsiteURL}>
            {externalWebsiteName}
          </a>
          <FontAwesomeIcon icon={'external-link-alt'} />
        </React.Fragment>
      )}
      content={(
        <span className='discovery-popover__text'>
          After filling the request form, once your search selection is approved, you can use the Gen3 Client
          to download the data from the selected studies to your local computer.
        </span>
      )}
    >
      <Button
        onClick={() => {
          const combinedIds = selectedResources.map((item) => item[props.props.config.features.exportToWorkspace.fillRequestFormCheckField]).join(',');
          const url = `${fillRequestFormURL}?query=${encodeURIComponent(combinedIds)}`;
          window.open(url, '_blank');
        }}
        type='default'
        className={`discovery-action-bar-button${(selectedResources.length === 0) ? '--disabled' : ''}`}
        disabled={selectedResources.length === 0}
        icon={<FileTextOutlined />}
      >
        {`Click Here to ${fillRequestFormDisplayText || 'Request Information'}`}
      </Button>

    </Popover>
  );
};

export default OpenFillRequestFormButton;
