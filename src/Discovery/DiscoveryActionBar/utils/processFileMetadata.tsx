import { hostname } from '../../../localconf';
import GenerateFilenameWithoutPrefix from '../../DiscoveryDetails/Components/FieldGrouping/TabField/DataDownloadList/ActionButtons/DownloadUtils/GenerateFilenameWithoutPrefix';

// this might replace the "assembleFileMetadata.tsx" file eventually
const processFileMetadata = (uidFieldName: string, manifestFieldName: string, fileCategory: string, selectedResources: any[]) => {
  const fileMetadata:any = {};
  selectedResources.forEach((study) => {
    if (study[uidFieldName]) {
      const uid = study[uidFieldName];
      const filename = GenerateFilenameWithoutPrefix(fileCategory, uid);
      const fileMetadataKey = (fileCategory === 'all_files' || fileCategory === 'file') ? uid : filename;
      if (study[manifestFieldName]) {
        if ('commons_url' in study && !(hostname.includes(study.commons_url))) { // PlanX addition to allow hostname based DRS in manifest download clients
          (fileMetadata[fileMetadataKey] ??= {}).file_manifest = {
            ...study[manifestFieldName].map((x) => ({
              ...x,
              commons_url: ('commons_url' in x)
                ? x.commons_url : study.commons_url,
            })),
          };
        } else {
          (fileMetadata[fileMetadataKey] ??= {}).file_manifest = { ...study[manifestFieldName] };
        }
      }
      if (fileCategory === 'all_files') {
        if (study.external_file_metadata) {
          (fileMetadata[fileMetadataKey] ??= {}).external_file_metadata = { ...study.external_file_metadata };
        }
      }
    }
  });
  return fileMetadata;
};

export default processFileMetadata;
