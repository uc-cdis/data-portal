import {
  checkIfCellContainsSearchTerm,
  checkIfChartContainsSearchTerm,
  checkIfDetailTableContainsSearchTerm,
  checkIfHiddenCellsContainSearchTerm,
} from './CheckSearchTermUtils';
import TableData from '../TestData/TableData';
import { IRowData } from '../Interfaces/Interfaces';

const rowObject: any = TableData.data[0];
const impossibleSearchInputValue =
  'ThisStringIsTooLongTooHaveBeenGeneratedByTheTestDataGenerator';

describe('checkIfHiddenCellsContainSearchTerm', () => {
  it(`should return search-highlight if the row object contains the given
  searchInputValue in any of its hidden cells`, () => {
    const searchInputValue = TableData.data[0]['valueSummary'][0]['name'];
    expect(
      checkIfHiddenCellsContainSearchTerm(rowObject, searchInputValue)
    ).toBe('search-highlight');
  });

  it(`should return an empty string if the row object does not contain
  the given searchInputValue in any of its hidden cells`, () => {
    expect(
      checkIfHiddenCellsContainSearchTerm(rowObject, impossibleSearchInputValue)
    ).toBe('');
  });
});

describe('checkIfDetailTableContainsSearchTerm', () => {
  it(`should return search-highlight if any cell in the detail table
  of the row object contains the given searchInputValue`, () => {
    let searchInputValue: string = '';
    let rowContainingSearchInput = 0;
    // Find a non-null minValue in test data and cast to a string
    // And store the location of the row
    TableData.data.forEach((obj, i) => {
      if (obj['minValue']) {
        rowContainingSearchInput = i;
        searchInputValue = obj['minValue'].toString();
      }
    });
    const rowWithSearchInput: any = TableData.data[rowContainingSearchInput];
    expect(
      checkIfDetailTableContainsSearchTerm(rowWithSearchInput, searchInputValue)
    ).toBe('search-highlight');
  });

  it('should return an empty string if none of the cells in the detail table of the row object contains the given searchInputValue', () => {
    expect(
      checkIfDetailTableContainsSearchTerm(
        rowObject,
        impossibleSearchInputValue
      )
    ).toBe('');
  });
});

describe('checkIfChartContainsSearchTerm', () => {
  it(`should return search-highlight if any cell value in
  the chart data of the row object contains the given searchInputValue`, () => {
    const searchInputValue =
      TableData.data[0]['valueSummary'][0]['personCount'];

    expect(checkIfChartContainsSearchTerm(rowObject, searchInputValue)).toBe(
      'search-highlight'
    );
  });

  it('should return an empty string if none of the cell values in the chart data of the row object contains the given searchInputValue', () => {
    expect(
      checkIfChartContainsSearchTerm(rowObject, impossibleSearchInputValue)
    ).toBe('');
  });
});

describe('checkIfCellContainsSearchTerm', () => {
  it('should return search-highlight if the given cellText contains the given searchInputValue ignoring case and trimming white spaces', () => {
    const searchInputValue = TableData.data[0]['conceptCode'];
    expect(
      checkIfCellContainsSearchTerm(searchInputValue, searchInputValue)
    ).toBe('search-highlight');
  });

  it('should return an empty string if the given cellText does not contain the given searchInputValue ignoring case and trimming white spaces', () => {
    const cellText = 'Value1';
    expect(
      checkIfCellContainsSearchTerm(cellText, impossibleSearchInputValue)
    ).toBe('');
  });
});
