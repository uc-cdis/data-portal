import { IColumnManagementData, IRowData } from '../../../Interfaces/Interfaces';
import { checkIfCellContainsSearchTerm, checkIfHiddenCellsContainSearchTerm } from '../../../Utils/CheckSearchTermUtils';

const showSearchBarMessage = (
  searchTerm:string,
  paginatedData:IRowData[],
  columnManagementData:IColumnManagementData,
) => {
  let foundSearchTermInHiddenColumn = false;
  const hiddenColumns: Array<string> = Object.keys(columnManagementData).filter((key) => columnManagementData[key] === false);
  const hiddenCellKeys = ['minValue', 'maxValue', 'meanValue', 'standardDeviation', 'valueSummary'];
  const hiddenColumnsContainHiddenCellKeys = hiddenCellKeys.some((key) => hiddenColumns.includes(key));
  if (searchTerm && hiddenColumns.length > 0) {
    paginatedData.forEach((rowObject: IRowData) => {
      hiddenColumns.forEach((hiddenKey) => {
        console.log('searchTerm', searchTerm);
        console.log('hiddenKey', hiddenKey);
        console.log('rowObject[hiddenKey]', rowObject[hiddenKey]);

        if (checkIfCellContainsSearchTerm(rowObject[hiddenKey], searchTerm)
              || (hiddenColumnsContainHiddenCellKeys
                 && checkIfHiddenCellsContainSearchTerm(rowObject, searchTerm))) {
          foundSearchTermInHiddenColumn = true;
        }
      });
    });
  }
  return foundSearchTermInHiddenColumn;
};

export default showSearchBarMessage;
