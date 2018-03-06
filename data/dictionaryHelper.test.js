const helper = require('./dictionaryHelper.js');
const utils = require('./utils.js');

describe('the dictionaryHelper', () => {
  it('knows how to load a json file', () => {
    const dict = utils.loadJsonFile(`${__dirname}/dictionary.json`);
    expect(dict.status).toBe('ok');
    expect(Object.prototype.hasOwnProperty.call(dict.data, '_definitions')).toBe(true);
    // currently only support 'experiment' or 'study' type dictionaries
    expect(Object.prototype.hasOwnProperty.call(dict.data, 'experiment') || Object.prototype.hasOwnProperty.call(dict.data, 'study')).toBe(true);
  });

  it('returns empty object if cannot load/parse json file', () => {
    const dict = utils.loadJsonFile('bogus.blabla');
    expect(typeof dict === 'object' && dict.status === 'error').toBe(true);
  });

  it('identifies experiment-type dictionaries', () => {
    const info = helper.dictToGQLSetup({ experiment: {}, case: {}, aliquot: {} });
    expect(info.experimentType).toBe('experiment');
    // expect(info.hasCaseType).toBe(true);
    // expect(info.hasAliquotType).toBe(true);
    expect(info.fileTypeList.length).toBe(0);
    expect(info.adminTypeList.length).toBe(0);
  });

  it('identifies study-type dictionaries', () => {
    const info = helper.dictToGQLSetup({ study: { category: 'administrative', links: [{ target_type: 'project', required: true }] } });
    expect(info.experimentType).toBe('study');
    // expect(info.hasCaseType).toBe(false);
    // expect(info.hasAliquotType).toBe(false);
    expect(info.fileTypeList.length).toBe(0);
    expect(info.adminTypeList.length).toBe(1);
  });

  it('finds file types in dictionary', () => {
    const dict = {
      experiment: { category: 'bla' },
      file1: { category: 'data_file' },
      file2: { category: 'data_file' },
      file3: { category: 'data_file' },
    };

    const info = helper.dictToGQLSetup(dict);
    expect(info.experimentType).toBe('experiment');
    expect(info.fileTypeList.length).toBe(3);
    expect(info.fileTypeList.sort()).toEqual(['file1', 'file2', 'file3']);
  });

  it('finds under-project admin types', () => {
    const dict = utils.loadJsonFile(`${__dirname}/dictionary.json`);
    expect(dict.status).toBe('ok');
    const setup = helper.dictToGQLSetup(dict.data);
    expect(setup.adminTypeList.length > 0).toBe(true);
  });
});
