import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TableRow from './TableRow';
import { IRowData } from '../../Interfaces/Interfaces';

describe('TableRow test', () => {
  const rowData: IRowData = {
    rowID: 0,
    vocabularyID: 'histogram_nonqualitative_hotdog_gp01ADjyWo',
    conceptID: 10,
    conceptCode: '6GPzNFCLMN',
    conceptName: 'snorkel_1e7hcdgXyQ',
    conceptClassID: 'sjJsjR91xS',
    numberOfPeopleWithVariable: 25,
    numberOfPeopleWhereValueIsFilled: 15,
    numberOfPeopleWhereValueIsNull: 5,
    valueStoredAs: 'Number',
    minValue: 8,
    maxValue: 42,
    meanValue: 5,
    standardDeviation: 2,
    valueSummary: [
      {
        start: 23,
        end: 49,
        personCount: 20,
      },
    ],
    numberOfPeopleWithVariablePercent: 10,
    numberOfPeopleWhereValueIsFilledPercent: 6,
    numberOfPeopleWhereValueIsNullPercent: 2,
  };

  const displayedKeys = [
    'vocabularyID',
    'conceptID',
    'conceptCode',
    'conceptName',
    'conceptClassID',
    'numberOfPeopleWithVariable',
    'numberOfPeopleWithVariablePercent',
    'numberOfPeopleWhereValueIsFilled',
    'numberOfPeopleWhereValueIsNullPercent',
    'valueStoredAs',
  ];

  it('renders the tableRow component and associated UI elements correctly', () => {
    render(
      <table>
        <tbody>
          <TableRow
            rowObject={rowData}
            handleTableChange={() => null}
            openDropdowns={[2]}
            columnsShown={11}
            searchTerm=''
          />
        </tbody>
      </table>,
    );
    const testIDs = ['expand-icon', 'table-row'];

    testIDs.forEach((testID: string) => {
      expect(screen.getByTestId(testID)).toBeInTheDocument();
    });
  });
  it('renders the tableRow component and associated key values correctly', () => {
    render(
      <table>
        <tbody>
          <TableRow
            rowObject={rowData}
            handleTableChange={() => null}
            openDropdowns={[0]}
            columnsShown={11}
            searchTerm=''
          />
        </tbody>
      </table>,
    );
    displayedKeys.forEach((key: string) => {
      expect(
        screen.getAllByText(rowData[key], { exact: false })[0],
      ).toBeInTheDocument();
    });
  });
});