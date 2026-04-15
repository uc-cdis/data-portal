import { hostname } from '../../../localconf';
import GenerateFilename from '../../DiscoveryDetails/Components/FieldGrouping/TabField/DataDownloadList/ActionButtons/DownloadUtils/GenerateFilename';

// this might replace the "assembleFileMetadata.tsx" file eventually
const processFileMetadata = (uidFieldName: string, manifestFieldName: string, selectedResources: any[]) => {
  const fileManifestsWithNames:any = {};
  selectedResources.forEach((study) => {
    if (study[uidFieldName] && study[manifestFieldName]) {
      const uid = study[uidFieldName];
      const manifestFilename = GenerateFilename('manifest', uid);
      if ('commons_url' in study && !(hostname.includes(study.commons_url))) { // PlanX addition to allow hostname based DRS in manifest download clients
        fileManifestsWithNames[manifestFilename] = {
          ...study[manifestFieldName].map((x) => ({
            ...x,
            commons_url: ('commons_url' in x)
              ? x.commons_url : study.commons_url,
          })),
        };
      } else {
        fileManifestsWithNames[manifestFilename] = { ...study[manifestFieldName] };
      }
    }
  });
  return fileManifestsWithNames;
};

export default processFileMetadata;
