import { get, unset, cloneDeep } from 'lodash';
import { datadogRum } from '@datadog/browser-rum';
import { manifestServiceApiPath, hostname } from '../../../../localconf';
import { DiscoveryConfig } from '../../../DiscoveryConfig';
import { fetchWithCreds } from '../../../../actions';
import { DownloadStatus } from '../../DiscoveryActionBarInterfaces';
import checkFederatedLoginStatus from '../checkFederatedStatus';
import { assembleAndExportMetadata } from './assembleAndExportMetadata';

const handleExportToWorkspaceClick = async (
  config: DiscoveryConfig,
  selectedResources: any[],
  setExportingToWorkspace: (arg0: boolean) => void,
  setDownloadStatus: (arg0: DownloadStatus) => void,
  history: any,
  location: any,
  healIDPLoginNeeded: boolean,
) => {
  const enableExportFullMetadata = config.features.exportToWorkspace?.enableExportFullMetadata;
  if (enableExportFullMetadata) {
    const keysToRemove = config.features.exportToWorkspace?.excludedMetadataFields;
    assembleAndExportMetadata(keysToRemove as Array<string>, selectedResources);
  }

  const { manifestFieldName } = config.features.exportToWorkspace;
  if (!manifestFieldName) {
    throw new Error(
      'Missing required configuration field `config.features.exportToWorkspace.manifestFieldName`',
    );
  }

  if (healIDPLoginNeeded) {
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
      return;
    }
  }

  setExportingToWorkspace(true);
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

  const projectNumber = selectedResources.map((study) => study.project_number);
  const studyName = selectedResources.map((study) => study.study_name);
  const repositoryName = selectedResources.map((study) => study.commons);
  datadogRum.addAction('exportToWorkspace', {
    exportToWorkspaceProjectNumber: projectNumber,
    exportToWorkspaceStudyName: studyName,
    exportToWorkspaceRepositoryName: repositoryName,
  });

  // post selected resources to manifestservice
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
  setExportingToWorkspace(false);
  // redirect to Workspaces page
  history.push('/workspace');
};

export default handleExportToWorkspaceClick;
