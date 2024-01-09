interface IValueSummary {
  name?: string;
  personCount?: number;
  start?: number;
  end?: number;
}

interface IRowData {
  vocabularyID: string;
  conceptID: number;
  conceptCode: string;
  conceptName: string;
  conceptClassID: string;
  numberOfPeopleWithVariable: number;
  numberOfPeopleWithVariablePercent: number;
  numberOfPeopleWhereValueIsFilled: number;
  numberOfPeopleWhereValueIsFilledPercent: number;
  numberOfPeopleWhereValueIsNull: number;
  numberOfPeopleWhereValueIsNullPercent: number;
  valueStoredAs: string;
  minValue: number | null;
  maxValue: number | null;
  meanValue: number | null;
  standardDeviation: number;
  valueSummary: IValueSummary[];
}
interface ITableData {
  total: number;
  data: IRowData[];
}

interface ISortConfig {
  sortKey: string | null;
  direction: 'ascending' | 'descending' | 'off';
}
export {
  IRowData, IValueSummary, ITableData, ISortConfig,
};
