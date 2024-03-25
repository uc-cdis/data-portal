import PreprocessTableData from './PreprocessTableData';

describe('PreprocessTableData', () => {
  it(`should preprocess table data correctly by adding
  percentage key value pairs`, () => {
    const inputData: any = {
      total: 10,
      data: [
        {
          numberOfPeopleWithVariable: 5,
          numberOfPeopleWhereValueIsFilled: 3,
          numberOfPeopleWhereValueIsNull: 2,
        },
        {
          numberOfPeopleWithVariable: 8,
          numberOfPeopleWhereValueIsFilled: 7,
          numberOfPeopleWhereValueIsNull: 1,
        },
      ],
    };

    const expectedOutput: any[] = [
      {
        numberOfPeopleWithVariable: 5,
        numberOfPeopleWhereValueIsFilled: 3,
        numberOfPeopleWhereValueIsNull: 2,
        numberOfPeopleWithVariablePercent: 50,
        numberOfPeopleWhereValueIsFilledPercent: 30,
        numberOfPeopleWhereValueIsNullPercent: 20,
        rowID: 0,
      },
      {
        numberOfPeopleWithVariable: 8,
        numberOfPeopleWhereValueIsFilled: 7,
        numberOfPeopleWhereValueIsNull: 1,
        numberOfPeopleWithVariablePercent: 80,
        numberOfPeopleWhereValueIsFilledPercent: 70,
        numberOfPeopleWhereValueIsNullPercent: 10,
        rowID: 1,
      },
    ];

    expect(PreprocessTableData(inputData)).toEqual(expectedOutput);
  });
});
