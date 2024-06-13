import { hostname } from '../../../localconf';

const assembleFileManifest = (manifestFieldName: string, selectedResources: any[]) => {
  // combine manifests from all selected studies
  const manifest:any = [];
  selectedResources.forEach((study) => {
    if (study[manifestFieldName]) {
      if ('commons_url' in study && !(hostname.includes(study.commons_url))) { // PlanX addition to allow hostname based DRS in manifest download clients
        // like FUSE
        manifest.push(...study[manifestFieldName].map((x) => ({
          ...x,
          commons_url: ('commons_url' in x)
            ? x.commons_url : study.commons_url,
        })));
      } else {
        manifest.push(...study[manifestFieldName]);
      }
    }
  });
  return manifest;
};

export default assembleFileManifest;
