import { IColumnManagementData } from '../Interfaces/Interfaces';

const DefaultAtlasColumnManagement:IColumnManagementData = {
  vocabularyID: true,
  conceptID: true,
  conceptCode: true,
  conceptName: true,
  conceptClassID: true,
  numberOfPeopleWithVariable: true,
  numberOfPeopleWhereValueIsFilled: true,
  numberOfPeopleWhereValueIsNull: true,
  valueStoredAs: true,
  valueSummary: true,
};

export default DefaultAtlasColumnManagement;
