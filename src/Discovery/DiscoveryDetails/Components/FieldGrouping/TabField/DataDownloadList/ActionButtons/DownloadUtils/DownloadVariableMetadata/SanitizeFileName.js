const SanitizeFileName = (unSanitizedfileName) => {
  // const validFileNameCharactersRegex =  /[A-Za-z0-9_-]+_\(\).*\[\]-\./g;
  const validFileNameCharactersRegex = /[^a-zA-Z0-9\[\]()_-]+/g;
  let fileName = unSanitizedfileName;
  const maximumAllowedFileNameLength = 6;
  const fileExtension = '.json';

  // Replace all invalid file name characters
  fileName = fileName.replace(validFileNameCharactersRegex,'');

   // Trim excessive filename characters
  fileName = fileName.substring(
    0,
    maximumAllowedFileNameLength - fileExtension.length,
  );
  // remove existing file extension and return with correct file extension
  fileName = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
  return `${fileName}${fileExtension}`;
};
