import React from 'react';
import { datadogRum } from '@datadog/browser-rum';
import { faro } from '@grafana/faro-core';
import { manifestServiceApiPath, hostname } from '../../../../localconf';
import { DiscoveryConfig } from '../../../DiscoveryConfig';
import { fetchWithCreds } from '../../../../actions';
import { DownloadStatus } from '../../DiscoveryActionBarInterfaces';
import checkFederatedLoginStatus from '../checkFederatedStatus';
import { assembleAndExportMetadata } from './assembleAndExportMetadata';
import { loadSelectedStudiesFromMDS } from '../../../Utils/MDSUtils/MDSUtils';
import { DOWNLOAD_FAIL_STATUS } from '../../DiscoveryActionBarConstants';

const handleExportToWorkspaceClick = async (
  config: DiscoveryConfig,
  selectedStudyRecords: any[],
  setExportingToWorkspace: (arg0: boolean) => void,
  setDownloadStatus: (arg0: DownloadStatus) => void,
  history: any,
  location: any,
  healIDPLoginNeeded: boolean,
) => {
  const { manifestFieldName } = config.features.exportToWorkspace;
  if (!manifestFieldName) {
    throw new Error(
      'Missing required configuration field `config.features.exportToWorkspace.manifestFieldName`',
    );
  }

  if (healIDPLoginNeeded) {
    return;
  }

  setExportingToWorkspace(true);
  // table records may not contain the file manifests / external file metadata
  // (e.g. when loaded from the aggregate MDS), so fetch the full metadata of the selected studies from MDS
  let selectedResources: any[];
  try {
    selectedResources = await loadSelectedStudiesFromMDS(
      selectedStudyRecords,
      config.minimalFieldMapping?.uid || '',
    );
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Could not load metadata of the selected studies from MDS: ', err);
    setExportingToWorkspace(false);
    setDownloadStatus({
      ...DOWNLOAD_FAIL_STATUS,
      message: {
        ...DOWNLOAD_FAIL_STATUS.message,
        title: 'Export failed',
        content: React.createElement('p', null, 'There was a problem loading the metadata of the selected studies. Please try again later.'),
      },
    });
    return;
  }

  if (config.features.exportToWorkspace.verifyExternalLogins) {
    const isLinked = await checkFederatedLoginStatus(
      setDownloadStatus,
      selectedResources,
      manifestFieldName,
      history,
      location,
    );
    if (!isLinked) {
      setExportingToWorkspace(false);
      return;
    }
  }

  // export metadata first, if enabled
  const enableExportFullMetadata = config.features.exportToWorkspace?.enableExportFullMetadata;
  if (enableExportFullMetadata) {
    const keysToRemove = config.features.exportToWorkspace?.excludedMetadataFields;
    assembleAndExportMetadata(keysToRemove as Array<string>, selectedResources);
  }

  // combine manifests from all selected studies
  const manifest: any = [];
  selectedResources.forEach((study) => {
    if (study[manifestFieldName]) {
      if ('commons_url' in study && !hostname.includes(study.commons_url)) {
        // PlanX addition to allow hostname based DRS in manifest download clients
        // like FUSE
        manifest.push(
          ...study[manifestFieldName].map((x) => ({
            ...x,
            commons_url: 'commons_url' in x ? x.commons_url : study.commons_url,
          })),
        );
      } else {
        manifest.push(...study[manifestFieldName]);
      }
    }
  });

  const projectNumber = selectedResources.map((study) => study.project_number || []);
  const studyName = selectedResources.map((study) => study.study_metadata?.minimal_info?.study_name || []);
  const repositoryName = selectedResources.map((study) => study.commons || []);
  const objectIDsInManifest: any[] = [];
  selectedResources.forEach(
    ((study) => {
      if (study.__manifest && Array.isArray(study.__manifest)) {
        objectIDsInManifest.push(study.__manifest.map((manifestObj) => manifestObj.object_id));
      }
    }),
  );
  const externalFileMetadataInManifest: any[] = [];
  selectedResources.forEach(
    ((study) => {
      if (study.external_file_metadata && Array.isArray(study.external_file_metadata)) {
        externalFileMetadataInManifest.push(...study.external_file_metadata);
      }
    }),
  );
  datadogRum.addAction('exportToWorkspace', {
    exportToWorkspaceProjectNumber: projectNumber,
    exportToWorkspaceStudyName: studyName,
    exportToWorkspaceRepositoryName: repositoryName,
    exportToWorkspaceObjectIDsinManifest: objectIDsInManifest,
    exportToWorkspaceExternalFileMetadataInManifest: externalFileMetadataInManifest,
  });
  faro.api.pushEvent(
    'exportToWorkspace',
    // Faro only accept string-string pairs in payload
    {
      exportToWorkspaceProjectNumber: projectNumber.join(','),
      exportToWorkspaceStudyName: studyName.join(','),
      exportToWorkspaceRepositoryName: repositoryName.join(','),
      exportToWorkspaceObjectIDsinManifest: objectIDsInManifest.join(','),
      exportToWorkspaceExternalFileMetadataInManifest: JSON.stringify(externalFileMetadataInManifest),
    },
  );

  // post exported manifest to manifestservice
  if (manifest.length) {
    const res = await fetchWithCreds({
      path: `${manifestServiceApiPath}`,
      body: JSON.stringify(manifest),
      method: 'POST',
    });
    if (res.status !== 200) {
      throw new Error(
        `Encountered error while exporting to Workspace: ${JSON.stringify(res)}`,
      );
    }
  }
  setExportingToWorkspace(false);
  // redirect to Workspaces page
  history.push('/workspace');
};

export default handleExportToWorkspaceClick;
