const calculateFileSize = (size) => {
  if (size >= 1000000) {
    return `${size / 1000000}MB`;
  } else if (size >= 1000) {
    return `${size / 1000}KB`;
  }
  return `${size}B`;
};

export default calculateFileSize;
