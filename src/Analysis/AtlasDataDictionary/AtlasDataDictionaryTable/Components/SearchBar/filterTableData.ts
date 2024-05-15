import { IRowData } from '../../Interfaces/Interfaces';
import { formatForSearchComparison } from '../../Utils/CheckSearchTermUtils';

const filterTableData = (TableData:IRowData[], searchTerm:string, setDisplayedData:Function) => {
  const filteredData = TableData.filter((item) => {
    const searchQuery = formatForSearchComparison(searchTerm);
    return Object.values(item).some((value) => {
      if (typeof value === 'string' || typeof value === 'number') {
        return formatForSearchComparison(value).includes(searchQuery);
      }
      if (Array.isArray(value)) {
        let doesArrayContainsSearchQuery = false;
        value.forEach((arrItem) => {
          Object.values(arrItem).some((arrObjValue) => {
            if (
              (typeof arrObjValue === 'string' || typeof arrObjValue === 'number')
               && formatForSearchComparison(arrObjValue).includes(searchQuery)
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
