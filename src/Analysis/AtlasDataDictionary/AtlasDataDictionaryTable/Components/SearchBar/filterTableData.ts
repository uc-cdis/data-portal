import { IRowData } from '../../Interfaces/Interfaces';
import { formatSearchQuery } from '../../Utils/CheckSearchTermUtils';

const filterTableData = (TableData:IRowData[], searchTerm:string, setDisplayedData:Function) => {
  const filteredData = TableData.filter((item) => {
    const searchQuery = formatSearchQuery(searchTerm);
    return Object.values(item).some((value) => {
      if (typeof value === 'string' || typeof value === 'number') {
        return formatSearchQuery(value).includes(searchQuery);
      }
      if (Array.isArray(value)) {
        let doesArrayContainsSearchQuery = false;
        value.forEach((arrItem) => {
          Object.values(arrItem).some((arrObjValue) => {
            if (
              (typeof arrObjValue === 'string'
                  || typeof arrObjValue === 'number')
                && formatSearchQuery(arrObjValue).includes(searchQuery)
            ) {
              doesArrayContainsSearchQuery = true;
            }
            return null;
          });
        });
        return doesArrayContainsSearchQuery;
      }
      return null;
    });
  });
  setDisplayedData(filteredData);
};

export default filterTableData;
