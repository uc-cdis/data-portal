import { datadogRum } from '@datadog/browser-rum';
import { faro } from '@grafana/faro-web-sdk';
import FileSaver from 'file-saver';
import { DiscoveryConfig } from '../../DiscoveryConfig';
import assembleFileManifest from './assembleFileManifest';

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
  const manifest = assembleFileManifest(manifestFieldName, selectedResources);
  const projectNumber = selectedResources.map((study) => study.project_number);
  const studyName = selectedResources.map((study) => study.study_name);
  const repositoryName = selectedResources.map((study) => study.commons);
  datadogRum.addAction('manifestDownload', {
    manifestDownloadProjectNumber: projectNumber,
    manifestDownloadStudyName: studyName,
    manifestDownloadRepositoryName: repositoryName,
  });
  faro.api.pushEvent(
    'manifestDownload',
    // Faro only accept string-string pairs in payload
    {
      manifestDownloadProjectNumber: projectNumber.join(','),
      manifestDownloadStudyName: studyName.join(','),
      manifestDownloadRepositoryName: repositoryName.join(','),
    },
  );
  // download the manifest
  const MANIFEST_FILENAME = 'manifest.json';
  const blob = new Blob([JSON.stringify(manifest, null, 2)], {
    type: 'text/json',
  });
  FileSaver.saveAs(blob, MANIFEST_FILENAME);
};

export default handleDownloadManifestClick;
