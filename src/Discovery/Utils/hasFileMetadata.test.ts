import { hasFileManifest, hasExternalFileMetadata } from './hasFileMetadata';

describe('hasFileManifest', () => {
  it('uses file_manifest_size when present', () => {
    expect(hasFileManifest({ file_manifest_size: 3 }, '__manifest')).toBe(true);
    expect(hasFileManifest({ file_manifest_size: 0 }, '__manifest')).toBe(false);
    // size field wins over the raw list
    expect(hasFileManifest({ file_manifest_size: 0, __manifest: [{}] }, '__manifest')).toBe(false);
  });

  it('falls back to the raw manifest list when the size field is missing', () => {
    expect(hasFileManifest({ __manifest: [{ object_id: 'a' }] }, '__manifest')).toBe(true);
    expect(hasFileManifest({ __manifest: [] }, '__manifest')).toBe(false);
    expect(hasFileManifest({}, '__manifest')).toBe(false);
  });
});

describe('hasExternalFileMetadata', () => {
  it('uses external_file_metadata_size when present', () => {
    expect(hasExternalFileMetadata({ external_file_metadata_size: 1 })).toBe(true);
    expect(hasExternalFileMetadata({ external_file_metadata_size: 0 })).toBe(false);
  });

  it('falls back to the raw external_file_metadata list when the size field is missing', () => {
    expect(hasExternalFileMetadata({ external_file_metadata: [{}] })).toBe(true);
    expect(hasExternalFileMetadata({})).toBe(false);
  });
});
