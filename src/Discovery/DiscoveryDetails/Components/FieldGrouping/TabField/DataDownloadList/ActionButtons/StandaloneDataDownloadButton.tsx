import { DownloadOutlined } from '@ant-design/icons';
import { useHistory, useLocation } from 'react-router-dom';
import { Button } from 'antd';
import React from 'react';
import {
  fenceDownloadPath,
  bundle,
} from '../../../../../../../localconf';
import DataDownloadListItem from '../Interfaces/DataDownloadListItem';
import DownloadDataFiles from './DownloadUtils/DownloadDataFiles/DownloadDataFiles';
import { UseHandleRedirectToLoginClickNonResumable } from '../../../../../../Utils/HandleRedirectToLoginClick';
import { DiscoveryConfig } from '../../../../../../DiscoveryConfig';
import DownloadStatus from '../Interfaces/DownloadStatus';
import { DiscoveryResource } from '../../../../../../Discovery';

interface StandaloneDataDownloadButtonProps {
    discoveryConfig: DiscoveryConfig;
    resourceInfo: DiscoveryResource;
    noData: boolean;
    isUserLoggedIn: boolean;
    userHasAccessToDownload: boolean;
    downloadStatus: DownloadStatus;
    setDownloadStatus: React.Dispatch<React.SetStateAction<DownloadStatus>>;
    missingRequiredIdentityProviders: string[];
    item: DataDownloadListItem;
}

const StandaloneDataDownloadButton = ({
  discoveryConfig,
  resourceInfo,
  noData,
  isUserLoggedIn,
  userHasAccessToDownload,
  downloadStatus,
  setDownloadStatus,
  missingRequiredIdentityProviders,
  item,
}: StandaloneDataDownloadButtonProps) => {
  const history = useHistory();
  const location = useLocation();
  const { HandleRedirectFromDiscoveryDetailsToLoginClick } = UseHandleRedirectToLoginClickNonResumable();
  const manifestFieldName: string | undefined = discoveryConfig?.features?.exportToWorkspace?.manifestFieldName;
  const uid = resourceInfo[discoveryConfig.minimalFieldMapping.uid] || '';

  if (!manifestFieldName || noData) {
    return null;
  }
  // Ask user to login before downloading
  if (!isUserLoggedIn || missingRequiredIdentityProviders.length) {
    return (
      <Button
        className='discovery-action-bar-button'
        disabled={Boolean(noData || downloadStatus.inProgress)}
        onClick={() => {
          HandleRedirectFromDiscoveryDetailsToLoginClick(uid);
        }}
      >
        Login to Download File
      </Button>
    );
  }
  const isEcosystemPortal = bundle === 'heal' || bundle === 'ecosystem';
  const useBatchExportForDataDownloadButton = Boolean(
    discoveryConfig?.features.exportToWorkspace.enableDownloadZip,
  );
  const verifyExternalLoginsNeeded = Boolean(
    discoveryConfig?.features.exportToWorkspace.verifyExternalLogins,
  );
    // for data ecosystem, if using batch export sower job
  if (isEcosystemPortal && useBatchExportForDataDownloadButton) {
    const fileManifestFromStudyMetadata: any[] = resourceInfo?.[manifestFieldName] || [];
    let selectedFileManifest: any[] = [];
    if (item.guid && fileManifestFromStudyMetadata) {
      selectedFileManifest = [fileManifestFromStudyMetadata.find((element: any) => element.object_id === item.guid)];
    }
    return (
      <Button
        data-testid='standaloneDataDownloadButton-ecosystem-batch-export'
        className='discovery-action-bar-button'
        disabled={Boolean(noData || downloadStatus.inProgress || !userHasAccessToDownload)}
        loading={downloadStatus.inProgress === 'DownloadDataFiles'}
        onClick={() => DownloadDataFiles(
          downloadStatus,
          setDownloadStatus,
          history,
          location,
          missingRequiredIdentityProviders,
          verifyExternalLoginsNeeded,
          selectedFileManifest,
        )}
      >
        Download File
      </Button>
    );
  }
  // regular download button
  return (
    <Button
      data-testid='standaloneDataDownloadButton-commons-regular-download'
      className='discovery-action-bar-button'
      href={`${fenceDownloadPath}/${item.guid}?expires_in=900&redirect`}
      target='_blank'
      type='text'
      // disable button if data has no GUID or user don't have access
      disabled={!item.guid || !userHasAccessToDownload}
      icon={<DownloadOutlined />}
    >
        Download File
    </Button>
  );
};

export default StandaloneDataDownloadButton;
