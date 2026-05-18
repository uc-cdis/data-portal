import { datadogRum } from '@datadog/browser-rum';
import { faro } from '@grafana/faro-core';
import FileSaver from 'file-saver';
import JSZip from 'jszip';
import { DiscoveryConfig } from '../../DiscoveryConfig';
import processFileMetadata from './processFileMetadata';
import GenerateFilenameWithoutPrefix from '../../DiscoveryDetails/Components/FieldGrouping/TabField/DataDownloadList/ActionButtons/DownloadUtils/GenerateFilenameWithoutPrefix';

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

  const fileMetadata = processFileMetadata(uidFieldName, manifestFieldName, 'manifest', selectedResources);
  console.log(fileMetadata);
  if (!Object.keys(fileMetadata).length) {
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
  if (Object.keys(fileMetadata).length === 1) {
    const manifestFilename = Object.keys(fileMetadata)[0];
    if (fileMetadata[manifestFilename].file_manifest) {
      const blob = new Blob([JSON.stringify(fileMetadata[manifestFilename].file_manifest, null, 2)], {
        type: 'text/json',
      });
      FileSaver.saveAs(blob, `${manifestFilename}.json`);
    }
  } else {
    // otherwise, we zip all manifests into a zip
    const zip = new JSZip();
    Object.entries(fileMetadata).forEach(([manifestFilename, fileMetadataContent]) => {
      if (fileMetadataContent.file_manifest) {
        zip.file(`${manifestFilename}.json`, JSON.stringify(fileMetadataContent, null, 2));
      }
    });
    const manifestsBundleFilename = GenerateFilenameWithoutPrefix('all_manifests');
    zip.generateAsync({ type: 'blob' })
      .then((content) => {
        FileSaver.saveAs(content, `${manifestsBundleFilename}.zip`);
      });
  }
};

export default handleDownloadManifestClick;
