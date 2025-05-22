import { DiscoveryResource } from '../Discovery';

const isManifestDataMissing = (
  resource: DiscoveryResource,
  manifestFieldName: string) => !resource[manifestFieldName] || resource[manifestFieldName]?.length === 0;

export default isManifestDataMissing;
