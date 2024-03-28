import { validFileNameCharactersRegex } from '../../../../../../../../../utils';

const SanitizeFileName = (unSanitizedfileName: string) => {
  let fileName = unSanitizedfileName;
  const maximumAllowedFileNameLength = 250;
  const fileExtension = '.json';
  // Replace all invalid file name characters
  fileName = fileName.replace(validFileNameCharactersRegex, '');
  // Trim excessive filename characters
  fileName = fileName.substring(0, maximumAllowedFileNameLength - fileExtension.length);
  // remove existing file extension and return with correct file extension
  fileName = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
  return `${fileName}${fileExtension}`;
};

export default SanitizeFileName;
