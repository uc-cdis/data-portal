import { hostname } from '../../../../../localconf';
import { DiscoveryConfig } from '../../../../DiscoveryConfig';
import DownloadJsonFile from './DownloadJsonFile';

const HandleDownloadManifestClick = (
  config: DiscoveryConfig,
  selectedResources: any[],
  missingRequiredIdentityProviders: string[],
) => {
  const { manifestFieldName } = config.features.exportToWorkspace;
  if (!manifestFieldName) {
    throw new Error(
      'Missing required configuration field `config.features.exportToWorkspace.manifestFieldName`',
    );
  }
  if (missingRequiredIdentityProviders.length) {
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
  DownloadJsonFile('manifest', manifest);
};

export default HandleDownloadManifestClick;
