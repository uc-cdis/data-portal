/* eslint-disable no-await-in-loop */
import { handleDataDictionaryNameValidation } from './utils';
import { validFileNameChecks } from '../utils';

describe('Tests for handleDataDictionaryNameValidation', () => {
  it('should accept a file name with valid characters', async () => {
    const validFileName = 'myFile-with_valid_characters123[]()_ .';
    await expect(handleDataDictionaryNameValidation({}, validFileName)).resolves.toBe(true);
  });
  it('should reject a file name with invalid characters', async () => {
    const badCharacters = '/:\\*?"<>|:;@#༺$$صباح﷽ㅏ€҉܏܏܏܏܏܏Ɯ܏܏␀😨😧😦😱😫😩🐔🐓ㅑㅕㅛㅠㅡㅣㄷㅍㅎ%^&*:!‮'.split('');
    for (let i = 0; i < validFileNameChecks.invalidWindowsFileNames.length; i += 1) {
      const randomAlphaNumericString = Math.random().toString(36).slice(2);
      const invalidFileName = randomAlphaNumericString + badCharacters[i];
      await expect(handleDataDictionaryNameValidation({}, invalidFileName)).rejects.toBe(
        'Data Dictionary name can only use alphabetic and numeric characters, and []() ._-');
    }
  });
  it('should reject file names that use a reserved filename', async () => {
    for (let i = 0; i < validFileNameChecks.invalidWindowsFileNames.length; i += 1) {
      const invalidFileName = validFileNameChecks.invalidWindowsFileNames[i];
      await expect(handleDataDictionaryNameValidation({}, invalidFileName)).rejects.toBe(
        'Data Dictionary name is a reserved file name, please pick a different name.');
    }
  });
  it('should reject a file name with greater than the allowed number of characters', async () => {
    const invalidFileName = 'a'.repeat(251);
    await expect(handleDataDictionaryNameValidation({}, invalidFileName)).rejects.toBe(
      'Data Dictionary name length is greater than 250 characters');
  });

  /*
  it(`should sanitize a file name with a single invalid character and
    return a sanitized name`, () => {
    const unSanitizedFileName = 'Staff participants: Baseline measures';
    const expectedSanitizedFileName = 'Staff participants Baseline measures.json';
    expect(SanitizeFileName(unSanitizedFileName)).toBe(
      expectedSanitizedFileName,
    );
  });

  it(`should sanitize a file name with many invalid characters and return the
      sanitized name`, () => {
    const unSanitizedFileName = '/:\\*?"<>|My :;@#༺$$صباح﷽ㅏ€҉܏܏܏܏܏܏Ɯ܏܏␀😨😧😦😱😫😩🐔🐓ㅑㅕㅛㅠㅡㅣㄷㅍㅎ%^&*F:il!e‮';
    const expectedSanitizedFileName = 'My File.json';
    expect(SanitizeFileName(unSanitizedFileName)).toBe(
      expectedSanitizedFileName,
    );
  });

  it(`should sanitize invalid Window's file names and return a
      sanitized name with a underscore appended before the file extension`, () => {
    invalidWindowsFileNames.forEach((invalidName) => {
      const expectedSanitizedFileName = `${invalidName}_.json`;
      expect(SanitizeFileName(invalidName)).toBe(
        expectedSanitizedFileName,
      );
    });
  });

  it('should reject file name if it exceeds the maximum allowed length', () => {
    const unSanitizedFileName = `${'a'.repeat(251)}.json`;
    const expectedSanitizedFileName = `${'a'.repeat(245)}.json`;
    expect(SanitizeFileName(unSanitizedFileName)).toBe(
      expectedSanitizedFileName,
    );
  });
  */
});
