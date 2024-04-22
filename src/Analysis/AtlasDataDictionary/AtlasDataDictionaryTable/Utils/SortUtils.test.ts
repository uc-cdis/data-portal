import { DetermineNextSortDirection, SortDataWithDirection } from './SortUtils';
import { ISortConfig } from '../Interfaces/Interfaces';

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

  const data = [
    { conceptID: 1, vocabularyID: 'A' },
    { conceptID: 2, vocabularyID: 'B' },
    { conceptID: 3, vocabularyID: 'C' },
  ];

  it('tests that SortDataWithDirection function with invalid sortKey throws expected error', () => {
    const sortKey = 'thisIsNotAValidKey';
    const direction = 'ascending';
    let actualErrorMsg = null;
    try {
      SortDataWithDirection(data, direction, sortKey);
    } catch (e) {
      actualErrorMsg = e.message;
    }
    const expectedErrorMsg = 'Invalid sortType parameter used with SortDataWithDirection';
    expect(actualErrorMsg).toEqual(expectedErrorMsg);
  });

  it('tests SortDataWithDirection function with ascending and descending directions for string', () => {
    const sortKeyForString = 'vocabularyID';
    let direction: ISortConfig['direction'] = 'ascending';
    let sortedData = SortDataWithDirection(data, direction, sortKeyForString);
    expect(sortedData[0].vocabularyID).toBe('A');
    expect(sortedData[1].vocabularyID).toBe('B');
    expect(sortedData[2].vocabularyID).toBe('C');

    direction = 'descending';
    sortedData = SortDataWithDirection(data, direction, sortKeyForString);
    expect(sortedData[0].vocabularyID).toBe('C');
    expect(sortedData[1].vocabularyID).toBe('B');
    expect(sortedData[2].vocabularyID).toBe('A');
  });
  it('tests SortDataWithDirection function with ascending and descending directions for number', () => {
    const sortKeyForString = 'conceptID';
    let direction: ISortConfig['direction'] = 'ascending';
    let sortedData = SortDataWithDirection(data, direction, sortKeyForString);
    expect(sortedData[0].conceptID).toBe(1);
    expect(sortedData[1].conceptID).toBe(2);
    expect(sortedData[2].conceptID).toBe(3);

    direction = 'descending';
    sortedData = SortDataWithDirection(data, direction, sortKeyForString);
    expect(sortedData[0].conceptID).toBe(3);
    expect(sortedData[1].conceptID).toBe(2);
    expect(sortedData[2].conceptID).toBe(1);
  });
});
