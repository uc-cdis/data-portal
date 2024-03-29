import { fileNameCharactersCheckRegex, invalidWindowsFileNames } from '../../../../../../../../../utils';

const SanitizeFileName = (unSanitizedfileName: string) => {
  let fileName = unSanitizedfileName;
  const maximumAllowedFileNameLength = 250;
  const fileExtension = '.json';
  // Replace all invalid file name characters
  fileName = fileName.replace(fileNameCharactersCheckRegex, '');
  // Trim excessive filename characters
  fileName = fileName.substring(0, maximumAllowedFileNameLength - fileExtension.length);
  // Ensure file name is not an invalid windows file name
  invalidWindowsFileNames.forEach((invalidName) => {
    if (invalidName === fileName) {
      fileName += '_';
    }
  });
  return `${fileName}${fileExtension}`;
};

export default SanitizeFileName;
