import { datadogRum } from '@datadog/browser-rum';
import { faro } from '@grafana/faro-core';
import FileSaver from 'file-saver';
import JSZip from 'jszip';
import { DiscoveryConfig } from '../../DiscoveryConfig';
import processFileMetadata from './processFileMetadata';
import GenerateFilename from '../../DiscoveryDetails/Components/FieldGrouping/TabField/DataDownloadList/ActionButtons/DownloadUtils/GenerateFilename';

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

  const uidFieldName = config.minimalFieldMapping?.uid || '';

  if (healIDPLoginNeeded) {
    return;
  }

  const fileManifestsWithNames = processFileMetadata(uidFieldName, manifestFieldName, selectedResources);
  if (!Object.keys(fileManifestsWithNames).length) {
    return;
  }

  const projectNumber = selectedResources.map((study) => study.project_number || []);
  const studyName = selectedResources.map((study) => study.study_metadata?.minimal_info?.study_name || []);
  const repositoryName = selectedResources.map((study) => study.commons || []);
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
  // if there is only 1 manifest, do not zip, save as JSON directly
  if (Object.keys(fileManifestsWithNames).length === 1) {
    const manifestFilename = Object.keys(fileManifestsWithNames)[0];
    const blob = new Blob([JSON.stringify(fileManifestsWithNames[manifestFilename], null, 2)], {
      type: 'text/json',
    });
    FileSaver.saveAs(blob, manifestFilename);
  } else {
    // otherwise, we zip all manifests into a zip
    const zip = new JSZip();
    Object.entries(fileManifestsWithNames).forEach(([manifestFilename, manifestBody]) => {
      zip.file(`${manifestFilename}`, JSON.stringify(manifestBody, null, 2));
    });
    const manifestsBundleFilename = GenerateFilename('all_manifests');
    zip.generateAsync({ type: 'blob' })
      .then((content) => {
        FileSaver.saveAs(content, manifestsBundleFilename);
      });
  }
};

export default handleDownloadManifestClick;
