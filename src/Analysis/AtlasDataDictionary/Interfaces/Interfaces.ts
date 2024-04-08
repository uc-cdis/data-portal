interface IValueSummary {
  valueAsString?: string;
  valueAsConceptID?: number;
  name?: string;
  personCount?: number;
  start?: number;
  end?: number;
}

interface IRowData {
  rowID: number;
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

interface IColumnManagementData {
  vocabularyID: boolean;
  conceptID: boolean;
  conceptCode: boolean;
  conceptName: boolean;
  conceptClassID: boolean;
  numberOfPeopleWithVariable: boolean;
  numberOfPeopleWhereValueIsFilled: boolean;
  numberOfPeopleWhereValueIsNull: boolean;
  valueStoredAs: boolean;
  valueSummary: boolean;
}

export {
  IRowData,
  IValueSummary,
  ITableData,
  ISortConfig,
  IColumnManagementData,
};
