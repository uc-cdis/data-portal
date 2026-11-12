import { DiscoveryResource } from '../Discovery';

// Records from the aggregate MDS only carry the sizes of the file manifest and external file
// metadata lists (`file_manifest_size` / `external_file_metadata_size`), not the lists themselves.
// Use the size field when present, otherwise fall back to checking the raw list.
const hasEntries = (
  resource: DiscoveryResource | null | undefined,
  sizeFieldName: string,
  listFieldName: string,
): boolean => {
  if (!resource) return false;
  const size = resource[sizeFieldName];
  if (size !== undefined && size !== null) {
    return Number(size) > 0;
  }
  return resource[listFieldName]?.length > 0;
};

export const hasFileManifest = (
  resource: DiscoveryResource | null | undefined,
  manifestFieldName: string,
): boolean => hasEntries(resource, 'file_manifest_size', manifestFieldName);

export const hasExternalFileMetadata = (
  resource: DiscoveryResource | null | undefined,
): boolean => hasEntries(resource, 'external_file_metadata_size', 'external_file_metadata');
