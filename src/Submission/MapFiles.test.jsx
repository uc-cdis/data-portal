import { fireEvent, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MapFiles, {
  groupSubmissionFiles,
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

/** @typedef {import('./types').SubmissionFile} SubmissionFile */
/** @typedef {import('./MapFiles').SubmissionFileMap} SubmissionFileMap */

const file1 = /** @type {SubmissionFile} */ ({ file_name: 'value1' });
const file2 = /** @type {SubmissionFile} */ ({ file_name: 'value2' });
const file3 = /** @type {SubmissionFile} */ ({ file_name: 'value3' });
const file4 = /** @type {SubmissionFile} */ ({ file_name: 'value4' });

test('renders', () => {
  const { container } = render(
    <MemoryRouter>
      <MapFiles
        fetchUnmappedFiles={() => {}}
        mapSelectedFiles={() => {}}
        username={''}
      />
    </MemoryRouter>
  );
  expect(container.firstElementChild).toHaveClass('map-files');
});

test('groups files by date', () => {
  const { filesByDate } = groupSubmissionFiles(testData.records);
  for (const date of Object.keys(filesByDate)) {
    const values = filesByDate[date];
    expect(values.length).toEqual(testGroupedData[date].length);

    for (const value of values)
      expect(testGroupedData[date].map((file) => file.did).includes(value.did));
  }
});

test('updates a map value', () => {
  /** @type {SubmissionFileMap} */
  let map = {
    1: { 1: file1, 2: file2 },
    2: { 3: file3 },
  };
  expect(map[2]).toEqual({ 3: file3 });

  map = setMapValue(map, 2, map[1]);
  expect(map[2]).toEqual(map[1]);

  map = setMapValue(map, 3, map[1]);
  expect(map[3]).toEqual(map[1]);
});

test('adds to a map value', () => {
  /** @type {SubmissionFileMap} */
  let map = {
    1: { 1: file1, 2: file2 },
    2: { 3: file3 },
  };
  expect(map[1]).toEqual({ 1: file1, 2: file2 });

  map = addToMap(map, 1, file4, '4');
  expect(map[1]).toEqual({ 1: file1, 2: file2, 4: file4 });

  map = addToMap(map, 3, file3, '3');
  expect(map[3]).toBeUndefined();
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
        username={''}
      />
    </MemoryRouter>
  );
  rerender(
    <MemoryRouter>
      <MapFiles
        fetchUnmappedFiles={() => {}}
        mapSelectedFiles={() => {}}
        unmappedFiles={testData.records}
        username={''}
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
    1: { 1: file1, 2: file2 },
    2: { 3: file3 },
  };

  expect(isSelected({ index: 1, did: '1', selectedFilesByGroup })).toBe(true);
  expect(isSelected({ index: 2, did: '1', selectedFilesByGroup })).toBe(false);
  expect(isSelected({ index: 2, did: '4', selectedFilesByGroup })).toBe(false);
  expect(isSelected({ index: 3, did: '1', selectedFilesByGroup })).toBe(false);
});

test('removes from the map', () => {
  /** @type {SubmissionFileMap} */
  let map = {
    1: { 1: file1, 2: file2 },
    2: { 3: file3 },
  };
  expect(map[1]).toEqual({ 1: file1, 2: file2 });

  map = removeFromMap(map, 1, '1');
  expect(map[1]).toEqual({ 2: file2 });

  map = removeFromMap(map, 3, '2');
  expect(map[3]).toBeUndefined();
});

test('returns if a map is empty', () => {
  /** @type {SubmissionFileMap} */
  const map = {
    1: { 1: file1, 2: file2 },
    2: { 3: file3 },
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
