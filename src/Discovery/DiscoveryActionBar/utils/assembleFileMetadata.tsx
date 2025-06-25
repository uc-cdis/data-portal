import { hostname } from '../../../localconf';

const assembleFileMetadata = (manifestFieldName: string, selectedResources: any[]) => {
  // combine manifests and external file metadata from all selected studies
  const fileManifest:any = [];
  const externalFileMetadata: any = [];
  selectedResources.forEach((study) => {
    if (study[manifestFieldName]) {
      if ('commons_url' in study && !(hostname.includes(study.commons_url))) { // PlanX addition to allow hostname based DRS in manifest download clients
        // like FUSE
        fileManifest.push(...study[manifestFieldName].map((x) => ({
          ...x,
          commons_url: ('commons_url' in x)
            ? x.commons_url : study.commons_url,
        })));
      } else {
        fileManifest.push(...study[manifestFieldName]);
      }
    }
    if (study.external_file_metadata) {
      externalFileMetadata.push(...study.external_file_metadata);
    }
  });
  return { fileManifest, externalFileMetadata };
};

export default assembleFileMetadata;
