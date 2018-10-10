import { hasKeyChain, calculateDropdownButtonConfigs } from './utils';

describe('utils for data visualization explorer', () => {
  it('returns correctly from hasKeyChain function', () => {
    const testObject1 = { a: { b: { c: 1 } } };
    const testObject2 = { a: { b: { c: 0 } } };
    const hasKeys = 'a.b.c';
    const hasNoKeys = 'a.b.c.d';
    expect(hasKeyChain(testObject1, hasKeys)).toBe(true);
    expect(hasKeyChain(testObject1, hasNoKeys)).toBe(false);
    expect(hasKeyChain({}, hasNoKeys)).toBe(false);
    expect(hasKeyChain(null, hasNoKeys)).toBe(false);
    expect(hasKeyChain(testObject2, hasKeys)).toBe(true);
  });

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
    const buttonsList1 = buttonConfigs.filter(b => b.dropdownId === '1');
    const buttonsList2 = buttonConfigs.filter(b => b.dropdownId === '2');
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
});

