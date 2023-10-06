const ProcessData = (sourceFieldData) => {
  const dataWithOnlyTitlesOrFileNames = sourceFieldData[0].filter((item:any) => {
    if (!('title' in item || 'file_name' in item)) {
      console.debug('Item without title or file_name:', item);
    }
    return 'title' in item || 'file_name' in item;
  });
  const processedDataForDataDownloadList = dataWithOnlyTitlesOrFileNames.map((obj:any) => ({
    title: obj.title || obj.file_name,
    description: obj.description,
  }));
  return processedDataForDataDownloadList;
};

export default ProcessData;
