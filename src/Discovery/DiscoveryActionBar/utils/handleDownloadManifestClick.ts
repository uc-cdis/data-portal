import { datadogRum } from '@datadog/browser-rum';
import FileSaver from 'file-saver';
import { hostname } from '../../../localconf';
import { DiscoveryConfig } from '../../DiscoveryConfig';

const handleDownloadManifestClick = (
  config: DiscoveryConfig,
  selectedResources: any[],
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
  datadogRum.addAction('manifestDownload', {
    manifestDownloadProjectNumber: projectNumber,
    manifestDownloadStudyName: studyName,
    manifestDownloadRepositoryName: repositoryName,
  });
  // download the manifest
  const MANIFEST_FILENAME = 'manifest.json';
  const blob = new Blob([JSON.stringify(manifest, null, 2)], {
    type: 'text/json',
  });
  FileSaver.saveAs(blob, MANIFEST_FILENAME);
};

export default handleDownloadManifestClick;