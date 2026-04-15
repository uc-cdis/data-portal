import moment from 'moment';
import GenerateFilename from './GenerateFilename';

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

describe('GenerateFilename', () => {
  describe('with studyID', () => {
    test('returns correct filename for "metadata"', () => {
      expect(GenerateFilename('metadata', STUDY)).toBe(
        `${HOST}-${STUDY}-${DATE}-meta.json`,
      );
    });

    test('returns correct filename for "vlmd"', () => {
      expect(GenerateFilename('vlmd', STUDY)).toBe(
        `${HOST}-${STUDY}-${DATE}-vars.zip`,
      );
    });

    test('returns correct filename for "manifest"', () => {
      expect(GenerateFilename('manifest', STUDY)).toBe(
        `${HOST}-${STUDY}-${DATE}-manifest.json`,
      );
    });

    test('returns correct filename for "file"', () => {
      expect(GenerateFilename('file', STUDY)).toBe(
        `${HOST}-${STUDY}-${DATE}-file.zip`,
      );
    });

    test('returns correct filename for "all_files"', () => {
      expect(GenerateFilename('all_files', STUDY)).toBe(
        `${HOST}-${STUDY}-${DATE}.zip`,
      );
    });
  });

  describe('without studyID', () => {
    test('omits studyID segment for "metadata"', () => {
      expect(GenerateFilename('metadata')).toBe(
        `${HOST}-${DATE}-meta.json`,
      );
    });

    test('omits studyID segment for "vlmd"', () => {
      expect(GenerateFilename('vlmd')).toBe(
        `${HOST}-${DATE}-vars.zip`,
      );
    });

    test('omits studyID segment for "manifest"', () => {
      expect(GenerateFilename('manifest')).toBe(
        `${HOST}-${DATE}-manifest.json`,
      );
    });

    test('omits studyID segment for "all_manifests"', () => {
      expect(GenerateFilename('all_manifests')).toBe(
        `${HOST}-${DATE}-manifests.zip`,
      );
    });

    test('omits studyID segment for "file"', () => {
      expect(GenerateFilename('file')).toBe(
        `${HOST}-${DATE}-file.zip`,
      );
    });

    test('omits studyID segment for "all_files"', () => {
      expect(GenerateFilename('all_files')).toBe(
        `${HOST}-${DATE}.zip`,
      );
    });

    test('empty string studyID behaves the same as omitted', () => {
      expect(GenerateFilename('metadata', '')).toBe(
        GenerateFilename('metadata'),
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
      expect(GenerateFilename('unknown_type', STUDY)).toBe('');
    });

    test('logs a console.error with the unknown category', () => {
      GenerateFilename('unknown_type', STUDY);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Unknown file category passed into GenerateFilename(): ',
        'unknown_type',
      );
    });

    test('returns empty string for empty category string', () => {
      expect(GenerateFilename('')).toBe('');
    });
  });

  describe('filename structure', () => {
    test('metadata filename starts with host', () => {
      const result = GenerateFilename('metadata', STUDY);
      expect(result.startsWith(HOST)).toBe(true);
    });

    test('filename contains the date', () => {
      const result = GenerateFilename('manifest', STUDY);
      expect(result).toContain(DATE);
    });

    test('filename contains studyID when provided', () => {
      const result = GenerateFilename('file', STUDY);
      expect(result).toContain(STUDY);
    });

    test('filename does not contain studyID segment when omitted', () => {
      const result = GenerateFilename('file');
      // Should not have two consecutive hyphens or the study value
      expect(result).not.toContain(`-${STUDY}-`);
      expect(result).toBe(`${HOST}-${DATE}-file.zip`);
    });
  });
});
