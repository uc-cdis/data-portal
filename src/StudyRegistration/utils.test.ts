/* eslint-disable no-await-in-loop */
import { handleDataDictionaryNameValidation } from './utils';
import { validFileNameChecks } from '../utils';

describe('Tests for handleDataDictionaryNameValidation', () => {
  it('should accept a file name with valid characters', async () => {
    const validFileName = 'myFile-with_valid_characters123[]()_ .';
    await expect(handleDataDictionaryNameValidation({}, validFileName)).resolves.toBe(true);
  });
  it('should accept a variety of file names with valid characters', async () => {
    const numberOfFileNameTests = 500;
    for (let i = 0; i < numberOfFileNameTests; i += 1) {
      const randomAlphaNumericString = Math.random().toString(36).slice(2);
      const otherAllowedCharacters = '_-()[]'.split('');
      const randomAllowedCharter = otherAllowedCharacters[
        Math.floor(Math.random() * (otherAllowedCharacters.length))
      ];
      const testFileName = randomAlphaNumericString + randomAllowedCharter;
      console.log(testFileName)
      await expect(handleDataDictionaryNameValidation({}, testFileName)).resolves.toBe(true);
    }
  });
  it('should reject a file name with invalid characters', async () => {
    const badCharacters = '/:\\*?"<>|:;@#༺$$صباح﷽ㅏ€҉܏܏܏܏܏܏Ɯ܏܏␀😨😧😦😱😫😩🐔🐓ㅑㅕㅛㅠㅡㅣㄷㅍㅎ%^&*:!‮';
    const badCharactersArray = badCharacters.split('');
    for (let i = 0; i < badCharactersArray.length; i += 1) {
      const randomAlphaNumericString = Math.random().toString(36).slice(2);
      const invalidFileName = randomAlphaNumericString + badCharactersArray[i];
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
    const invalidFileName = 'a'.repeat(validFileNameChecks.maximumAllowedFileNameLength + 1);
    await expect(handleDataDictionaryNameValidation({}, invalidFileName)).rejects.toBe(
      'Data Dictionary name length is greater than 250 characters');
  });
});
