import { createFilterInfo, isSurvivalAnalysisEnabled } from './utils';

test('creates filter info object', () => {
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

test('checks whether survival analysis is enabled', () => {
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
