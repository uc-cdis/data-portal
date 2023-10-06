interface sourceFieldDataObj {title?:string, file_name?:string,description?:string,[key: string]: any }


const ProcessData = (sourceFieldData) => {
    const dataWithOnlyTitlesOrFileNames = sourceFieldData[0].filter((item:sourceFieldDataObj) => {
        if (!("title" in item || "file_name" in item)) {
          console.log("Item without title or file_name:", item);
        }
        return "title" in item || "file_name" in item;
      });
      const processedDataForDataDownloadList = dataWithOnlyTitlesOrFileNames.map((obj:{title?:string, file_name?:string,description?:string,[key: string]: any }) => ({
        title: obj.title || obj.file_name,
        description: obj.description,
      }));
      return processedDataForDataDownloadList;
}

export default ProcessData;
