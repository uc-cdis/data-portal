import SanitizeFileName from './SanitizeFileName';

describe('SanitizeFileName', () => {
  it(`should sanitize file name with valid characters and return the
      original name if it is within the maximum length`, () => {
    const unSanitizedValidFileName = 'myFile-with_valid_characters123.json';
    expect(SanitizeFileName(unSanitizedValidFileName)).toBe(
      `${unSanitizedValidFileName}`,
    );
  });

  it(`should sanitize file name with invalid characters and return the
      sanitized name`, () => {
    const unSanitizedFileName = '/:\\*?"<>|My :;@#༺$$صباح﷽ㅏ€҉܏܏܏܏܏܏Ɯ܏܏␀😨😧😦😱😫😩🐔🐓ㅑㅕㅛㅠㅡㅣㄷㅍㅎ%^&*F:il!e‮.exe';
    const expectedSanitizedFileName = 'My File.json';
    expect(SanitizeFileName(unSanitizedFileName)).toBe(
      expectedSanitizedFileName,
    );
  });

  it('should truncate file name if it exceeds the maximum allowed length', () => {
    const unSanitizedFileName = `${'a'.repeat(251)}.json`;
    const expectedSanitizedFileName = `${'a'.repeat(245)}.json`;
    expect(SanitizeFileName(unSanitizedFileName)).toBe(
      expectedSanitizedFileName,
    );
  });
});
