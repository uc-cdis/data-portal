import GenerateFilenameWithoutPrefix from './GenerateFilenameWithoutPrefix';

jest.mock('../../../../../../../../localconf', () => ({
  hostnameWithSubdomain: 'test-portal',
}));

jest.mock('moment', () => {
  const mockMoment = () => ({
    format: (fmt: string) => {
      if (fmt === 'YYYY-MM-DD') return '2026-04-08';
      return '';
    },
  });
  return mockMoment;
});

const DATE = '2026-04-08';
const HOST = 'test-portal';
const STUDY = 'study-123';

describe('GenerateFilenameWithoutPrefix', () => {
  describe('with studyID', () => {
    test('returns correct filename for "metadata"', () => {
      expect(GenerateFilenameWithoutPrefix('metadata', STUDY)).toBe(
        `${HOST}-${STUDY}-${DATE}-meta`,
      );
    });

    test('returns correct filename for "vlmd"', () => {
      expect(GenerateFilenameWithoutPrefix('vlmd', STUDY)).toBe(
        `${HOST}-${STUDY}-${DATE}-vars`,
      );
    });

    test('returns correct filename for "manifest"', () => {
      expect(GenerateFilenameWithoutPrefix('manifest', STUDY)).toBe(
        `${HOST}-${STUDY}-${DATE}-manifest`,
      );
    });

    test('returns correct filename for "file"', () => {
      expect(GenerateFilenameWithoutPrefix('file', STUDY)).toBe(
        `${HOST}-${STUDY}-${DATE}-file`,
      );
    });

    test('returns correct filename for "all_files"', () => {
      expect(GenerateFilenameWithoutPrefix('all_files', STUDY)).toBe(
        `${HOST}-${STUDY}-${DATE}`,
      );
    });
  });

  describe('without studyID', () => {
    test('omits studyID segment for "metadata"', () => {
      expect(GenerateFilenameWithoutPrefix('metadata')).toBe(
        `${HOST}-${DATE}-meta`,
      );
    });

    test('omits studyID segment for "vlmd"', () => {
      expect(GenerateFilenameWithoutPrefix('vlmd')).toBe(
        `${HOST}-${DATE}-vars`,
      );
    });

    test('omits studyID segment for "manifest"', () => {
      expect(GenerateFilenameWithoutPrefix('manifest')).toBe(
        `${HOST}-${DATE}-manifest`,
      );
    });

    test('omits studyID segment for "all_manifests"', () => {
      expect(GenerateFilenameWithoutPrefix('all_manifests')).toBe(
        `${HOST}-${DATE}-manifests`,
      );
    });

    test('omits studyID segment for "file"', () => {
      expect(GenerateFilenameWithoutPrefix('file')).toBe(
        `${HOST}-${DATE}-file`,
      );
    });

    test('omits studyID segment for "all_files"', () => {
      expect(GenerateFilenameWithoutPrefix('all_files')).toBe(
        `${HOST}-${DATE}`,
      );
    });

    test('empty string studyID behaves the same as omitted', () => {
      expect(GenerateFilenameWithoutPrefix('metadata', '')).toBe(
        GenerateFilenameWithoutPrefix('metadata'),
      );
    });
  });

  describe('unknown fileCategory', () => {
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleSpy.mockRestore();
    });

    test('returns empty string for an unknown category', () => {
      expect(GenerateFilenameWithoutPrefix('unknown_type', STUDY)).toBe('');
    });

    test('logs a console.error with the unknown category', () => {
      GenerateFilenameWithoutPrefix('unknown_type', STUDY);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Unknown file category passed into GenerateFilenameWithoutPrefix(): ',
        'unknown_type',
      );
    });

    test('returns empty string for empty category string', () => {
      expect(GenerateFilenameWithoutPrefix('')).toBe('');
    });
  });

  describe('filename structure', () => {
    test('metadata filename starts with host', () => {
      const result = GenerateFilenameWithoutPrefix('metadata', STUDY);
      expect(result.startsWith(HOST)).toBe(true);
    });

    test('filename contains the date', () => {
      const result = GenerateFilenameWithoutPrefix('manifest', STUDY);
      expect(result).toContain(DATE);
    });

    test('filename contains studyID when provided', () => {
      const result = GenerateFilenameWithoutPrefix('file', STUDY);
      expect(result).toContain(STUDY);
    });

    test('filename does not contain studyID segment when omitted', () => {
      const result = GenerateFilenameWithoutPrefix('file');
      // Should not have two consecutive hyphens or the study value
      expect(result).not.toContain(`-${STUDY}-`);
      expect(result).toBe(`${HOST}-${DATE}-file`);
    });
  });
});
