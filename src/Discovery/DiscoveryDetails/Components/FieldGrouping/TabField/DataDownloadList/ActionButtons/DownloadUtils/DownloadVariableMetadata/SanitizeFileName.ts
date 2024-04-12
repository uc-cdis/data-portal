import { validFileNameChecks } from '../../../../../../../../../utils';


const SanitizeFileName = (unSanitizedfileName: string) => {
  let fileName = unSanitizedfileName;
  const fileExtension = '.json';
  // Replace all invalid file name characters
  fileName = fileName.replace(validFileNameChecks.fileNameCharactersCheckRegex, '');
  // Trim excessive filename characters
  fileName = fileName.substring(0, validFileNameChecks.maximumAllowedFileNameLength - fileExtension.length);
  // Ensure file name is not an invalid Window's file name
  validFileNameChecks.invalidWindowsFileNames.forEach((invalidName) => {
    if (invalidName === fileName) {
      fileName += '_';
    }
  });
  return `${fileName}${fileExtension}`;
};

export default SanitizeFileName;
