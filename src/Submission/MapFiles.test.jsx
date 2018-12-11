import React from 'react';
import { mount } from 'enzyme';
import { createMemoryHistory } from 'history';
import { StaticRouter } from 'react-router-dom';
import MapFiles from './MapFiles';
import * as testData from './__test__/data.json';
import * as testGroupedData from './__test__/expectedGroupFiles.json';

describe('MapFiles', () => {
  const fetchUnmappedFiles = jest.fn();
  const mapSelectedFiles = jest.fn();
  const history = createMemoryHistory('/submission/files');
  const user = { username: 'testuser' };

  const component = mount(
    <StaticRouter location={{ pathname: '/submission/files' }} context={{}}>
      <MapFiles
        fetchUnmappedFiles={fetchUnmappedFiles}
        mapSelectedFiles={mapSelectedFiles}
        history={history}
        unmappedFiles={testData.records}
        user={user}
      />
    </StaticRouter>,
  );
  const instance = component.find(MapFiles).instance();

  it('renders', () => {
    expect(component.find(MapFiles).length).toBe(1);
  });

  it('groups files by date', () => {
    instance.onUpdate();
    Object.keys(instance.state.filesByDate).forEach((date) => {
      const values = instance.state.filesByDate[date];
      expect(values.length).toEqual(testGroupedData[date].length);
      values.forEach((val) => {
        expect(testGroupedData[date].map(file => file.did).includes(val.did));
      });
    });
  });

  it('updates a map value', () => {
    let map = {
      field1: new Set(['value1', 'value2']),
      field2: new Set(['value3']),
    };
    expect(map.field2).toEqual(new Set(['value3']));
    map = instance.setMapValue(map, 'field2', map.field1);
    expect(map.field2).toEqual(map.field1);
    map = instance.setMapValue(map, 'field3', map.field1);
    expect(map.field3).toEqual(map.field1);
  });

  it('adds to a map value', () => {
    let map = {
      field1: new Set(['value1', 'value2']),
      field2: new Set(['value3']),
    };
    expect(map.field1).toEqual(new Set(['value1', 'value2']));
    map = instance.addToMap(map, 'field1', 'value4');
    expect(map.field1).toEqual(new Set(['value1', 'value2', 'value4']));
    map = instance.addToMap(map, 'field3', 'value3');
    expect(map.field3).toBeUndefined();
  });

  it('removes from the map', () => {
    let map = {
      field1: new Set(['value1', 'value2']),
      field2: new Set(['value3']),
    };
    expect(map.field1).toEqual(new Set(['value1', 'value2']));
    map = instance.removeFromMap(map, 'field1', 'value1');
    expect(map.field1).toEqual(new Set(['value2']));
    map = instance.removeFromMap(map, 'field3', map.field1);
    expect(map.field3).toBeUndefined();
  });

  it('returns if all files should be selected', () => {
    instance.setState({
      selectedFilesByGroup: {
        1: new Set('value1', 'value2'),
        2: new Set('value3'),
      },
      unselectedFilesByGroup: {
        1: new Set(),
        2: new Set(),
      },
    });
    expect(instance.isSelectAll('1')).toBe(true);

    instance.setState({
      unselectedFilesByGroup: {
        1: new Set('value1', 'value2'),
        2: new Set('value3'),
      },
      selectedFilesByGroup: {
        1: new Set(),
        2: new Set(),
      },
    });
    expect(instance.isSelectAll('1')).toBe(false);

    instance.setState({
      unselectedFilesByGroup: {
        1: new Set(),
        2: new Set(),
      },
      selectedFilesByGroup: {
        1: new Set(),
        2: new Set(),
      },
    });
    expect(instance.isSelectAll('1')).toBe(false);
  });

  it('returns if a file should be selected', () => {
    instance.setState({
      selectedFilesByGroup: {
        1: new Set('1', '2'),
        2: new Set('3'),
      },
      unselectedFilesByGroup: {
        1: new Set(),
        2: new Set(),
      },
    });

    expect(instance.isSelected('1', '1')).toBe(true);
    expect(instance.isSelected('2', '1')).toBe(false);
    expect(instance.isSelected('3', '1')).toBe(false);
  });

  it('returns if a map is empty', () => {
    const map = {
      field1: new Set(['value1', 'value2']),
      field2: new Set(['value3']),
    };
    expect(instance.isMapEmpty(map)).toEqual(false);
    expect(instance.isMapEmpty({})).toEqual(true);
  });


  it('toggles a checkbox', () => {
    instance.setState({
      selectedFilesByGroup: {
        '09/11/18': new Set(),
      },
      unselectedFilesByGroup: {
        '09/11/18': new Set([testGroupedData['09/11/18']]),
      },
    });

    const date = '09/11/18';
    const fileToToggle = testGroupedData['09/11/18'].find(file => instance.isFileReady(file));

    expect(fileToToggle).toBeDefined();
    instance.toggleCheckBox(date, fileToToggle);
    expect(!instance.state.unselectedFilesByGroup[date].has(fileToToggle));
    expect(instance.state.selectedFilesByGroup[date].has(fileToToggle));

    instance.toggleCheckBox(date, fileToToggle);
    expect(instance.state.unselectedFilesByGroup[date].has(fileToToggle));
    expect(!instance.state.selectedFilesByGroup[date].has(fileToToggle));
  });

  it('toggles select all', () => {
    instance.setState({
      selectedFilesByGroup: {
        0: new Set(),
      },
      unselectedFilesByGroup: {
        0: new Set(['1', '2', '3', '4']),
      },
    });

    instance.toggleSelectAll('0');
    expect(instance.state.selectedFilesByGroup['0']).toEqual(new Set(['1', '2', '3', '4']));
    expect(instance.state.unselectedFilesByGroup['0']).toEqual(new Set());

    instance.setState({
      selectedFilesByGroup: {
        0: new Set(['1', '2']),
      },
      unselectedFilesByGroup: {
        0: new Set(['3', '4']),
      },
    });

    instance.toggleSelectAll('0');
    expect(instance.state.selectedFilesByGroup['0']).toEqual(new Set(['1', '2', '3', '4']));
    expect(instance.state.unselectedFilesByGroup['0']).toEqual(new Set());

    instance.setState({
      selectedFilesByGroup: {
        0: new Set(['1', '2', '3', '4']),
      },
      unselectedFilesByGroup: {
        0: new Set(),
      },
    });

    instance.toggleSelectAll('0');
    expect(instance.state.selectedFilesByGroup['0']).toEqual(new Set());
    expect(instance.state.unselectedFilesByGroup['0']).toEqual(new Set(['1', '2', '3', '4']));

    instance.toggleSelectAll('3');
    expect(instance.state.selectedFilesByGroup['0']).toEqual(new Set());
    expect(instance.state.unselectedFilesByGroup['0']).toEqual(new Set(['1', '2', '3', '4']));
  });

  it('returns if a file is ready to be mapped', () => {
    const files = testData.records.filter(file =>
      file.hashes && Object.keys(file.hashes).length === 0,
    );
    expect(files.length).toBeGreaterThan(0);
    expect(instance.isFileReady(files[0])).toBe(false);
    const readyFiles = testData.records.filter(file =>
      file.hashes && Object.keys(file.hashes).length > 0,
    );
    expect(readyFiles.length).toBeGreaterThan(0);
    expect(instance.isFileReady(readyFiles[0])).toBe(true);
  });
});
