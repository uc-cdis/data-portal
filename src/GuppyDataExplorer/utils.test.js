import {
  calculateDropdownButtonConfigs,
  createFilterInfo,
  humanizeNumber,
  isSurvivalAnalysisEnabled,
} from './utils';

describe('utils for data visualization explorer', () => {
  it('calculate dropdown button configurations correctly', () => {
    const buttonConfigs = [
      {
        enabled: true,
        title: 'Download Clinical',
        dropdownId: '1',
      },
      {
        enabled: true,
        title: 'Download Manifest',
        dropdownId: '1',
      },
      {
        enabled: true,
        title: 'Export All to Saturn',
        dropdownId: '2',
      },
      {
        enabled: true,
        title: 'Export All to GoogleCloud',
        dropdownId: '2',
      },
      {
        enabled: true,
        title: 'Reset Filters',
      },
    ];
    const input = {
      dropdowns: {
        1: {
          title: 'Download',
        },
        2: {
          title: 'Upload',
        },
      },
      buttons: buttonConfigs,
    };
    const buttonsList1 = buttonConfigs.filter((b) => b.dropdownId === '1');
    const buttonsList2 = buttonConfigs.filter((b) => b.dropdownId === '2');
    const expectOutput = {
      1: {
        dropdownConfig: {
          title: 'Download',
        },
        buttonConfigs: buttonsList1,
        cnt: buttonsList1.length,
      },
      2: {
        dropdownConfig: {
          title: 'Upload',
        },
        buttonConfigs: buttonsList2,
        cnt: buttonsList2.length,
      },
    };
    expect(calculateDropdownButtonConfigs(input)).toEqual(expectOutput);
  });

  it('creates filter info object', () => {
    const filterConfig = {
      anchor: { field: 'anchor_field', options: [], tabs: [] },
      tabs: [
        { title: 'a', fields: ['foo_foo', 'foo_bar'] },
        { title: 'b', fields: ['bar.baz'] },
      ],
    };
    const fieldMapping = [
      { field: 'foo_bar', name: 'Customized Name' },
      { field: 'bar.baz', tooltip: 'lorem ipsum' },
    ];
    const expected = {
      anchor_field: { label: 'Anchor Field' },
      foo_foo: { label: 'Foo Foo' },
      foo_bar: { label: 'Customized Name' },
      'bar.baz': { label: 'Bar Baz', tooltip: 'lorem ipsum' },
    };
    expect(createFilterInfo(filterConfig, fieldMapping)).toEqual(expected);
  });

  it('humanize number', () => {
    expect(humanizeNumber(12)).toBe(12);
    expect(humanizeNumber(1200, 1)).toBe('1.2K');
    expect(humanizeNumber(1200000, 1)).toBe('1.2M');
    expect(humanizeNumber(1200000000, 1)).toBe('1.2B');
    expect(humanizeNumber(1200000000000, 1)).toBe('1.2T');
    expect(humanizeNumber(1200000000000000, 1)).toBe('1.2Qa');
  });

  it('checks whether survival analysis is enabled', () => {
    // not enabled
    let falsyConfig;
    expect(isSurvivalAnalysisEnabled(falsyConfig)).toBe(false);
    falsyConfig = {};
    expect(isSurvivalAnalysisEnabled(falsyConfig)).toBe(false);
    falsyConfig = { result: {} };
    expect(isSurvivalAnalysisEnabled(falsyConfig)).toBe(false);
    falsyConfig = { result: { survival: false } };
    expect(isSurvivalAnalysisEnabled(falsyConfig)).toBe(false);
    falsyConfig = { result: { risktable: false } };
    expect(isSurvivalAnalysisEnabled(falsyConfig)).toBe(false);
    falsyConfig = { result: { survival: false, risktable: false } };
    expect(isSurvivalAnalysisEnabled(falsyConfig)).toBe(false);

    // enabled
    let truthyConfig;
    truthyConfig = { result: { survival: true } };
    expect(isSurvivalAnalysisEnabled(truthyConfig)).toBe(true);
    truthyConfig = { result: { risktable: true } };
    expect(isSurvivalAnalysisEnabled(truthyConfig)).toBe(true);
    truthyConfig = { result: { survival: true, risktable: false } };
    expect(isSurvivalAnalysisEnabled(truthyConfig)).toBe(true);
    truthyConfig = { result: { survival: false, risktable: true } };
    expect(isSurvivalAnalysisEnabled(truthyConfig)).toBe(true);
    truthyConfig = { result: { survival: true, risktable: true } };
    expect(isSurvivalAnalysisEnabled(truthyConfig)).toBe(true);
  });
});
