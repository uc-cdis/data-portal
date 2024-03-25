import { IRowData } from '../Interfaces/Interfaces';

const PreprocessTableData = (TableData: any): IRowData[] => {
  const UnprocessedTableData = TableData.data;
  const { total } = TableData;

  const processedTableData = UnprocessedTableData.map(
    (object: any, i: number) => {
      const numberOfPeopleWithVariablePercent = Math.trunc(
        (object.numberOfPeopleWithVariable / total) * 100,
      );
      const numberOfPeopleWhereValueIsFilledPercent = Math.trunc(
        (object.numberOfPeopleWhereValueIsFilled / total) * 100,
      );
      const numberOfPeopleWhereValueIsNullPercent = Math.trunc(
        (object.numberOfPeopleWhereValueIsNull / total) * 100,
      );

      return {
        ...object,
        rowID: i,
        numberOfPeopleWithVariablePercent,
        numberOfPeopleWhereValueIsFilledPercent,
        numberOfPeopleWhereValueIsNullPercent,
      };
    },
  );
  return processedTableData;
};
export default PreprocessTableData;
