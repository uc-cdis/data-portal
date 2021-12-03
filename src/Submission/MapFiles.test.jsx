import { fireEvent, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MapFiles, {
  groupUnmappedFiles,
  setMapValue,
  addToMap,
  removeFromMap,
  isSelectAll,
  isSelected,
  isMapEmpty,
  isFileReady,
} from './MapFiles';
import * as testData from './__test__/data.json';
import * as testGroupedData from './__test__/expectedGroupFiles.json';

test('renders', () => {
  const { container } = render(
    <MemoryRouter>
      <MapFiles
        fetchUnmappedFiles={() => {}}
        mapSelectedFiles={() => {}}
        history={{}}
        user={{}}
      />
    </MemoryRouter>
  );
  expect(container.firstElementChild).toHaveClass('map-files');
});

test('groups files by date', () => {
  const { filesByDate } = groupUnmappedFiles(testData.records);
  for (const date of Object.keys(filesByDate)) {
    const values = filesByDate[date];
    expect(values.length).toEqual(testGroupedData[date].length);

    for (const value of values)
      expect(testGroupedData[date].map((file) => file.did).includes(value.did));
  }
});

test('updates a map value', () => {
  let map = {
    field1: { 1: 'value1', 2: 'value2' },
    field2: { 3: 'value3' },
  };
  expect(map.field2).toEqual({ 3: 'value3' });

  map = setMapValue(map, 'field2', map.field1);
  expect(map.field2).toEqual(map.field1);

  map = setMapValue(map, 'field3', map.field1);
  expect(map.field3).toEqual(map.field1);
});

test('adds to a map value', () => {
  let map = {
    field1: { 1: 'value1', 2: 'value2' },
    field2: { 3: 'value3' },
  };
  expect(map.field1).toEqual({ 1: 'value1', 2: 'value2' });

  map = addToMap(map, 'field1', 'value4', '4');
  expect(map.field1).toEqual({ 1: 'value1', 2: 'value2', 4: 'value4' });

  map = addToMap(map, 'field3', 'value3', '3');
  expect(map.field3).toBeUndefined();
});

test('returns if all files should be selected', () => {
  expect(
    isSelectAll({
      index: '1',
      allFilesByGroup: { 1: { 1: 'value1', 2: 'value2' }, 2: { 3: 'value3' } },
      selectedFilesByGroup: { 1: { 1: 'value1', 2: 'value2' }, 2: {} },
    })
  ).toBe(true);

  expect(
    isSelectAll({
      index: '1',
      allFilesByGroup: { 1: { 1: 'value1', 2: 'value2' }, 2: { 3: 'value3' } },
      selectedFilesByGroup: { 1: {}, 2: {} },
    })
  ).toBe(false);

  expect(
    isSelectAll({
      index: '2',
      allFilesByGroup: { 1: {}, 2: { 1: 'value1' } },
      selectedFilesByGroup: { 1: {}, 2: {} },
    })
  ).toBe(false);
});

test('toggles a checkbox', () => {
  // TODO
});

test('toggles select all', () => {
  const { container, rerender } = render(
    <MemoryRouter>
      <MapFiles
        fetchUnmappedFiles={() => {}}
        mapSelectedFiles={() => {}}
        history={{}}
        user={{}}
      />
    </MemoryRouter>
  );
  rerender(
    <MemoryRouter>
      <MapFiles
        fetchUnmappedFiles={() => {}}
        mapSelectedFiles={() => {}}
        history={{}}
        unmappedFiles={testData.records}
        user={{}}
      />
    </MemoryRouter>
  );

  const selectAllElement = container.querySelector(`input[id='0']`);
  fireEvent.click(selectAllElement);
  expect(selectAllElement).toBeChecked();

  fireEvent.click(selectAllElement);
  expect(selectAllElement).not.toBeChecked();
});

test('returns if a file should be selected', () => {
  const selectedFilesByGroup = {
    1: { 1: 'value1', 2: 'value2' },
    2: { 3: 'value3' },
  };

  expect(isSelected({ index: '1', did: '1', selectedFilesByGroup })).toBe(true);
  expect(isSelected({ index: '2', did: '1', selectedFilesByGroup })).toBe(
    false
  );
  expect(isSelected({ index: '2', did: '4', selectedFilesByGroup })).toBe(
    false
  );
  expect(isSelected({ index: '3', did: '1', selectedFilesByGroup })).toBe(
    false
  );
});

test('removes from the map', () => {
  let map = {
    field1: { 1: 'value1', 2: 'value2' },
    field2: { 3: 'value3' },
  };
  expect(map.field1).toEqual({ 1: 'value1', 2: 'value2' });

  map = removeFromMap(map, 'field1', '1');
  expect(map.field1).toEqual({ 2: 'value2' });

  map = removeFromMap(map, 'field3', '2');
  expect(map.field3).toBeUndefined();
});

test('returns if a map is empty', () => {
  const map = {
    field1: { 1: 'value1', 2: 'value2' },
    field2: { 3: 'value3' },
  };
  expect(isMapEmpty(map)).toEqual(false);
  expect(isMapEmpty({})).toEqual(true);
});

test('returns if a file is ready to be mapped', () => {
  const readyFiles = testData.records.filter(
    (file) => file.hashes && Object.keys(file.hashes).length > 0
  );
  expect(readyFiles.length).toBeGreaterThan(0);
  expect(isFileReady(readyFiles[0])).toBe(true);
});
