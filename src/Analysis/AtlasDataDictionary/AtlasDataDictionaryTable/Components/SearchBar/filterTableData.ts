import { IRowData } from '../../Interfaces/Interfaces';

const filterTableData = (TableData:IRowData[], searchTerm:string, setData:Function) => {
  const filteredData = TableData.filter((item) => {
    const searchQuery = searchTerm.toLowerCase().trim();
    return Object.values(item).some((value) => {
      if (typeof value === 'string' || typeof value === 'number') {
        return value.toString().toLowerCase().includes(searchQuery);
      }
      if (Array.isArray(value)) {
        let doesArrayContainsSearchQuery = false;
        value.forEach((arrItem) => {
          Object.values(arrItem).some((arrObjValue) => {
            if (
              (typeof arrObjValue === 'string'
                  || typeof arrObjValue === 'number')
                && arrObjValue.toString().toLowerCase().includes(searchQuery)
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
  setData(filteredData);
};

export default filterTableData;
