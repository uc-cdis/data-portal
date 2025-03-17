export const MAX_NUMBER_OF_ITEMS_IN_LIST = 5;

export const ProcessData = (sourceFieldData:any) => {
  const dataWithOnlyTitlesOrFileNames = sourceFieldData[0].filter((item:any) => {
    if (!('title' in item || 'file_name' in item)) {
      console.debug('Item without title or file_name:', item);
    }
    return 'title' in item || 'file_name' in item;
  });
  let processedDataForDataDownloadList = dataWithOnlyTitlesOrFileNames.map((obj:any) => ({
    title: obj.title || obj.file_name,
    description: obj.description,
    guid: obj.object_id,
  }));
  let dataForDataDownloadListHasBeenTruncated = false;
  if (processedDataForDataDownloadList.length > MAX_NUMBER_OF_ITEMS_IN_LIST) {
    processedDataForDataDownloadList = processedDataForDataDownloadList.slice(0, MAX_NUMBER_OF_ITEMS_IN_LIST);
    dataForDataDownloadListHasBeenTruncated = true;
  }
  processedDataForDataDownloadList = processedDataForDataDownloadList.sort((a, b) => a.title.localeCompare(b.title, undefined, { numeric: true, sensitivity: 'base' }));
  return { processedDataForDataDownloadList, dataForDataDownloadListHasBeenTruncated };
};
