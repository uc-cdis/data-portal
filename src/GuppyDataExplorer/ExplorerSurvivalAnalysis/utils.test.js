import { FILTER_TYPE } from '../ExplorerFilterSetWorkspace/utils';
import {
  checkIfFilterHasOptedOutConsortiums,
  checkIfFilterInScope,
} from './utils';

describe('utils tests', () => {
  describe('check if a filter state is in scope for survival analysis', () => {
    const __combineMode = /** @type {'AND'} */ ('AND');
    const consortiums = ['foo', 'bar'];
    const optionFilter = {
      __type: FILTER_TYPE.OPTION,
      selectedValues: ['foo', 'bar'],
    };
    const rangeFilter = {
      __type: FILTER_TYPE.RANGE,
      lowerBound: 0,
      upperBound: 1,
    };
    test('standard filter state, empty', () => {
      expect(
        checkIfFilterInScope(consortiums, {
          __combineMode,
          __type: FILTER_TYPE.STANDARD,
          value: {},
        })
      ).toBe(true);
    });
    test('composed filter state, empty', () => {
      expect(
        checkIfFilterInScope(consortiums, {
          __combineMode,
          __type: FILTER_TYPE.COMPOSED,
          value: [],
        })
      ).toBe(true);
    });
    test('standard filter state, no consortium filter', () => {
      expect(
        checkIfFilterInScope(consortiums, {
          __combineMode,
          __type: FILTER_TYPE.STANDARD,
          value: { x: optionFilter, y: rangeFilter },
        })
      ).toBe(true);
    });
    test('composed filter state, no consortium filter', () => {
      expect(
        checkIfFilterInScope(consortiums, {
          __combineMode,
          __type: FILTER_TYPE.COMPOSED,
          value: [
            {
              __combineMode,
              __type: FILTER_TYPE.STANDARD,
              value: { x: optionFilter },
            },
            {
              __combineMode,
              __type: FILTER_TYPE.COMPOSED,
              value: [
                {
                  __combineMode,
                  __type: FILTER_TYPE.STANDARD,
                  value: { x: optionFilter },
                },
                {
                  __combineMode,
                  __type: FILTER_TYPE.STANDARD,
                  value: { y: rangeFilter },
                },
              ],
            },
          ],
        })
      ).toBe(true);
    });
    test('standard filter state, consortium filter in scope', () => {
      expect(
        checkIfFilterInScope(consortiums, {
          __combineMode,
          __type: FILTER_TYPE.STANDARD,
          value: { consortium: optionFilter, y: rangeFilter },
        })
      ).toBe(true);
    });
    test('composed filter state, consortium filter in scope', () => {
      expect(
        checkIfFilterInScope(consortiums, {
          __combineMode,
          __type: FILTER_TYPE.COMPOSED,
          value: [
            {
              __combineMode,
              __type: FILTER_TYPE.STANDARD,
              value: { x: optionFilter },
            },
            {
              __combineMode,
              __type: FILTER_TYPE.COMPOSED,
              value: [
                {
                  __combineMode,
                  __type: FILTER_TYPE.STANDARD,
                  value: { consortium: optionFilter },
                },
                {
                  __combineMode,
                  __type: FILTER_TYPE.STANDARD,
                  value: { y: rangeFilter },
                },
              ],
            },
          ],
        })
      ).toBe(true);
    });
    test('standard filter state, consortium filter out of scope', () => {
      expect(
        checkIfFilterInScope(consortiums, {
          __combineMode,
          __type: FILTER_TYPE.STANDARD,
          value: {
            consortium: { ...optionFilter, selectedValues: ['baz'] },
            y: rangeFilter,
          },
        })
      ).toBe(false);
    });
    test('composed filter state, consortium filter out of scope', () => {
      expect(
        checkIfFilterInScope(consortiums, {
          __combineMode,
          __type: FILTER_TYPE.COMPOSED,
          value: [
            {
              __combineMode,
              __type: FILTER_TYPE.STANDARD,
              value: {
                consortiums: { ...optionFilter, selectedValues: ['baz'] },
              },
            },
            {
              __combineMode,
              __type: FILTER_TYPE.COMPOSED,
              value: [
                {
                  __combineMode,
                  __type: FILTER_TYPE.STANDARD,
                  value: { consortium: optionFilter },
                },
                {
                  __combineMode,
                  __type: FILTER_TYPE.STANDARD,
                  value: { y: rangeFilter },
                },
              ],
            },
          ],
        })
      ).toBe(true);
    });
  });

  describe('check if a filter set has opted-out consortiums', () => {
    const __combineMode = /** @type {'AND'} */ ('AND');
    test('empty consortiums in config, no opted-out consortiums', () => {
      expect(checkIfFilterHasOptedOutConsortiums([], {})).toBeFalsy();
    });
    test('All Subject filter set', () => {
      expect(
        checkIfFilterHasOptedOutConsortiums(['INRG', 'INSTRuCT'], {})
      ).toBeFalsy();
      expect(
        checkIfFilterHasOptedOutConsortiums(['INRG', 'INSTRuCT', 'NODAL'], {})
      ).toBeTruthy();
    });
    test('Composed filter set', () => {
      expect(
        checkIfFilterHasOptedOutConsortiums(['INRG', 'INSTRuCT', 'NODAL'], {
          __type: FILTER_TYPE.COMPOSED,
          value: [
            {
              __combineMode,
              __type: FILTER_TYPE.STANDARD,
              value: {
                consortium: {
                  __type: FILTER_TYPE.OPTION,
                  selectedValues: ['INRG', 'INSTRuCT'],
                },
              },
            },
            {
              __combineMode,
              __type: FILTER_TYPE.STANDARD,
              value: {
                consortium: {
                  __type: FILTER_TYPE.OPTION,
                  selectedValues: ['INRG'],
                },
              },
            },
          ],
        })
      ).toBeFalsy();
      expect(
        checkIfFilterHasOptedOutConsortiums(['INRG', 'INSTRuCT', 'NODAL'], {
          __type: FILTER_TYPE.COMPOSED,
          value: [
            {
              __combineMode,
              __type: FILTER_TYPE.STANDARD,
              value: {
                consortium: {
                  __type: FILTER_TYPE.OPTION,
                  selectedValues: ['INRG', 'INSTRuCT', 'NODAL'],
                },
              },
            },
            {
              __combineMode,
              __type: FILTER_TYPE.STANDARD,
              value: {
                consortium: {
                  __type: FILTER_TYPE.OPTION,
                  selectedValues: ['INRG'],
                },
              },
            },
          ],
        })
      ).toBeTruthy();
    });

    test('Standard filter set', () => {
      expect(
        checkIfFilterHasOptedOutConsortiums(['INRG', 'INSTRuCT', 'NODAL'], {
          __type: FILTER_TYPE.STANDARD,
          value: {
            consortium: {
              __type: FILTER_TYPE.OPTION,
              selectedValues: ['INRG', 'INSTRuCT'],
            },
          },
        })
      ).toBeFalsy();
      expect(
        checkIfFilterHasOptedOutConsortiums(['INRG', 'INSTRuCT', 'NODAL'], {
          __type: FILTER_TYPE.STANDARD,
          value: {
            consortium: {
              __type: FILTER_TYPE.OPTION,
              selectedValues: ['INRG', 'INSTRuCT', 'OTHER'],
            },
          },
        })
      ).toBeTruthy();
    });
  });
});
