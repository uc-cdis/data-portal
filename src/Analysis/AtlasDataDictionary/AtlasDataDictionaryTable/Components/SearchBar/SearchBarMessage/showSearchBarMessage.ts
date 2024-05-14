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
        // If cell contains search term associated with hidden column key, show message
        if (checkIfCellContainsSearchTerm(rowObject[hiddenKey], searchTerm)) {
          foundSearchTermInHiddenColumn = true;

          // if hidden column is value summary, check the hidden the values for the cells in dropdown, if true show message
        } else if (hiddenColumns.includes('valueSummary')
            && checkIfHiddenCellsContainSearchTerm(rowObject, searchTerm)) {
          foundSearchTermInHiddenColumn = true;

          // if hidden key is a key associated with secondary percentages, check for those as well
        } else if (hiddenColumns.includes('numberOfPeopleWithVariable')
            || hiddenColumns.includes('numberOfPeopleWhereValueIsFilled')
            || hiddenColumns.includes('numberOfPeopleWhereValueIsNull')) {
          console.log('we hit the edge case!');
          if (checkIfCellContainsSearchTerm(rowObject[hiddenKey+'Percent'], searchTerm)) {
            foundSearchTermInHiddenColumn = true;
          }
        }
      });
    });
  }
  return foundSearchTermInHiddenColumn;
};

export default showSearchBarMessage;
