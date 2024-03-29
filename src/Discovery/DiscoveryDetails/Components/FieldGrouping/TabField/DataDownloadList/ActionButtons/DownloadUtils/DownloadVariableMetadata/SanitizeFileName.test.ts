import { invalid } from 'moment';
import SanitizeFileName from './SanitizeFileName';
import { invalidWindowsFileNames } from '../../../../../../../../../utils';

describe('SanitizeFileName', () => {
  it(`should sanitize a file name with valid characters and return the
      original name if it is within the maximum length and not an invalid name`, () => {
    const unSanitizedValidFileName = 'myFile-with_valid_characters123';
    const expectedSanitizedFileName = `${unSanitizedValidFileName}.json`;
    expect(SanitizeFileName(unSanitizedValidFileName)).toBe(expectedSanitizedFileName);
  });

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
    const expectedSanitizedFileNames = ['CON_.json', 'PRN_.json', 'AUX_.json', 'NUL_.json',
      'COM0_.json', 'COM1_.json', 'COM2_.json', 'COM3_.json', 'COM4_.json', 'COM5_.json',
      'COM6_.json', 'COM7_.json', 'COM8_.json', 'COM9_.json', 'COM.json', 'COM.json',
      'COM.json', 'LPT0_.json', 'LPT1_.json', 'LPT2_.json', 'LPT3_.json', 'LPT4_.json',
      'LPT5_.json', 'LPT6_.json', 'LPT7_.json', 'LPT8_.json', 'LPT9_.json', 'LPT.json',
      'LPT.json', 'LPT.json'];
    invalidWindowsFileNames.forEach((invalidName:string, i) => {
      expect(SanitizeFileName(invalidName)).toBe(
        expectedSanitizedFileNames[i],
      );
    });
  });

  it('should truncate file name if it exceeds the maximum allowed length', () => {
    const unSanitizedFileName = `${'a'.repeat(251)}.json`;
    const expectedSanitizedFileName = `${'a'.repeat(245)}.json`;
    expect(SanitizeFileName(unSanitizedFileName)).toBe(
      expectedSanitizedFileName,
    );
  });
});
