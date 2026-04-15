import { hostname } from '../../../../../../../../localconf';
import { DiscoveryConfig } from '../../../../../../../DiscoveryConfig';
import DownloadJsonFile from './DownloadJsonFile';
import GenerateFilename from './GenerateFilename';

const HandleDownloadManifestClick = (
  config: DiscoveryConfig,
  selectedResource: any,
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

  if (!selectedResource[manifestFieldName]) {
    return;
  }

  // since this button is from Discovery Details component, there will only be one study being selected at a time
  const uid = selectedResource[config.minimalFieldMapping.uid];
  const filename = GenerateFilename('manifest', uid);
  const manifest: any = [];
  if ('commons_url' in selectedResource && !hostname.includes(selectedResource.commons_url)) {
    // PlanX addition to allow hostname based DRS in manifest download clients
    // like FUSE
    manifest.push(
      ...selectedResource[manifestFieldName].map((x) => ({
        ...x,
        commons_url: 'commons_url' in x ? x.commons_url : selectedResource.commons_url,
      })),
    );
  } else {
    manifest.push(...selectedResource[manifestFieldName]);
  }
  DownloadJsonFile(filename, selectedResource[manifestFieldName]);
};

export default HandleDownloadManifestClick;
