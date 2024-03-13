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

  it('tests SortDataWithDirection function with ascending direction and valid sortKey', () => {
    const data = [
      { name: 'John Doe', exampleKey: 'A' },
      { name: 'Jane Doe', exampleKey: 'B' },
      { name: 'Mike Doe', exampleKey: 'C' },
    ];
    const sortKey = 'exampleKey';
    const direction = 'ascending';

    const sortedData = SortDataWithDirection(data, direction, sortKey);

    expect(sortedData[0].name).toBe('John Doe');
    expect(sortedData[1].name).toBe('Jane Doe');
    expect(sortedData[2].name).toBe('Mike Doe');
  });

  it('tests SortDataWithDirection function with descending direction and valid sortKey', () => {
    const data = [
      { name: 'John Doe', exampleKey: 'A' },
      { name: 'Jane Doe', exampleKey: 'B' },
      { name: 'Mike Doe', exampleKey: 'C' }
    ];
    const sortKey = 'exampleKey';
    const direction = 'descending';

    const sortedData = SortDataWithDirection(data, direction, sortKey);

    expect(sortedData[0].name).toBe('Mike Doe');
    expect(sortedData[1].name).toBe('Jane Doe');
    expect(sortedData[2].name).toBe('John Doe');
  });
});
