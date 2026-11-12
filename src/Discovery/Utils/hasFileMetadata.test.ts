import { hasFileManifest, hasExternalFileMetadata } from './hasFileMetadata';
import { DiscoveryResource } from '../Discovery';

// The tests only need the fields read by these functions, not a complete DiscoveryResource
const mockResource = (fields: Partial<DiscoveryResource>) => fields as DiscoveryResource;

describe('hasFileManifest', () => {
  it('uses file_manifest_size when present', () => {
    expect(hasFileManifest(mockResource({ file_manifest_size: 3 }), '__manifest')).toBe(true);
    expect(hasFileManifest(mockResource({ file_manifest_size: 0 }), '__manifest')).toBe(false);
    // size field wins over the raw list
    expect(hasFileManifest(mockResource({ file_manifest_size: 0, __manifest: [{}] }), '__manifest')).toBe(false);
  });

  it('returns false when there is no resource', () => {
    expect(hasFileManifest(null, '__manifest')).toBe(false);
    expect(hasFileManifest(undefined, '__manifest')).toBe(false);
  });

  it('falls back to the raw manifest list when the size field is missing', () => {
    expect(hasFileManifest(mockResource({ __manifest: [{ object_id: 'a' }] }), '__manifest')).toBe(true);
    expect(hasFileManifest(mockResource({ __manifest: [] }), '__manifest')).toBe(false);
    expect(hasFileManifest(mockResource({}), '__manifest')).toBe(false);
  });
});

describe('hasExternalFileMetadata', () => {
  it('uses external_file_metadata_size when present', () => {
    expect(hasExternalFileMetadata(mockResource({ external_file_metadata_size: 1 }))).toBe(true);
    expect(hasExternalFileMetadata(mockResource({ external_file_metadata_size: 0 }))).toBe(false);
  });

  it('returns false when there is no resource', () => {
    expect(hasExternalFileMetadata(null)).toBe(false);
    expect(hasExternalFileMetadata(undefined)).toBe(false);
  });

  it('falls back to the raw external_file_metadata list when the size field is missing', () => {
    expect(hasExternalFileMetadata(mockResource({ external_file_metadata: [{}] }))).toBe(true);
    expect(hasExternalFileMetadata(mockResource({}))).toBe(false);
  });
});
