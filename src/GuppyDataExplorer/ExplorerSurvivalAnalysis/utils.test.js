import { FILTER_TYPE } from '../ExplorerFilterSetWorkspace/utils';
import { checkIfFilterInScope } from './utils';

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
