import { IColumnManagementData, IRowData } from '../../../Interfaces/Interfaces';
import { checkIfCellContainsSearchTerm, checkIfHiddenCellsContainSearchTerm } from '../../../Utils/CheckSearchTermUtils';

const showSearchBarMessage = (
  searchTerm:string,
  paginatedData:IRowData[],
  columnManagementData:IColumnManagementData,
) => {
  let foundSearchTermInHiddenColumn = false;
  const hiddenColumns: Array<string> = Object.keys(columnManagementData).filter((key) => columnManagementData[key] === false);

  if (searchTerm && hiddenColumns.length > 0) {
    paginatedData.forEach((rowObject: IRowData) => {
      hiddenColumns.forEach((hiddenKey) => {
        if (checkIfCellContainsSearchTerm(rowObject[hiddenKey], searchTerm)
              || (hiddenColumns.includes('valueSummary')
                 && checkIfHiddenCellsContainSearchTerm(rowObject, searchTerm))) {
          foundSearchTermInHiddenColumn = true;
        }
      });
    });
  }
  return foundSearchTermInHiddenColumn;
};

export default showSearchBarMessage;
