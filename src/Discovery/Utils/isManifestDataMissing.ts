import { DiscoveryResource } from '../Discovery';

const isManifestDataMissing = (resource: DiscoveryResource) => !resource.__manifest || resource.__manifest?.length === 0;

export default isManifestDataMissing;
