import { DetermineNextSortDirection, SortDataWithDirection } from './SortUtils';
import { ISortConfig } from '../Interfaces/Interfaces';
import ColumnsItems from './ColumnItems';

describe('SortUtils', () => {
  it('tests DetermineNextSortDirection function with valid sortKey and direction', () => {
    const sortKey = 'ascending';
    const sortConfig: ISortConfig = { sortKey, direction: 'ascending' };
    const newDirection = DetermineNextSortDirection(sortConfig, sortKey);
    expect(newDirection).toBe('descending');
  });

  it('tests DetermineNextSortDirection function with same sortKey and off direction', () => {
    const sortKey = 'off';
    const sortConfig: ISortConfig = { sortKey, direction: 'off' };
    const newDirection = DetermineNextSortDirection(sortConfig, sortKey);
    expect(newDirection).toBe('ascending');
  });

  it('tests that SortDataWithDirection function with invalid sortKey throws expected error', () => {
    const data = [
      { name: 'John Doe', exampleKey: 'A' },
      { name: 'Jane Doe', exampleKey: 'B' },
      { name: 'Mike Doe', exampleKey: 'C' },
    ];
    const sortKey = 'exampleKey';
    const direction = 'ascending';
    // const sortedData = SortDataWithDirection(data, direction, sortKey);
    // expect(SortDataWithDirection(data, direction, sortKey)).toThrow(
    //   'Invalid sortType parameter used with SortDataWithDirection');
    let actualErrorMsg = null;
    try {
      SortDataWithDirection(data, direction, sortKey);
    } catch (e) {
      actualErrorMsg = e.message;
    }
    const expectedErrorMsg = 'Invalid sortType parameter used with SortDataWithDirection';
    expect(actualErrorMsg).toEqual(expectedErrorMsg);
  });

  it('tests SortDataWithDirection function with descending directions for string', () => {
    const data = [
      { name: 'John Doe', vocabularyID: 'A' },
      { name: 'Jane Doe', vocabularyID: 'B' },
      { name: 'Mike Doe', vocabularyID: 'C' },
    ];
    const sortKeyForString = 'vocabularyID';
    let direction: 'ascending' | 'descending' | null = 'descending';
    let sortedData = SortDataWithDirection(data, direction, sortKeyForString);
    expect(sortedData[0].name).toBe('Mike Doe');
    expect(sortedData[1].name).toBe('Jane Doe');
    expect(sortedData[2].name).toBe('John Doe');

    direction = 'ascending';
    sortedData = SortDataWithDirection(data, direction, sortKeyForString);
    expect(sortedData[0].name).toBe('John Doe');
    expect(sortedData[1].name).toBe('Jane Doe');
    expect(sortedData[2].name).toBe('Mike Doe');
  });
});
