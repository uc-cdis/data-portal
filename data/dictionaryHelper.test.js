const helper = require('./dictionaryHelper.js');
const utils = require('./utils.js');

describe('the dictionaryHelper', () => {
  it('knows how to load a json file', () => {
    const dict = utils.loadJsonFile(`${__dirname}/dictionary.json`);
    expect(dict.status).toBe('ok');
    expect(
      Object.prototype.hasOwnProperty.call(dict.data, '_definitions')
    ).toBe(true);
    // currently only support 'study' type dictionary
    expect(Object.prototype.hasOwnProperty.call(dict.data, 'study')).toBe(true);
  });

  it('returns empty object if cannot load/parse json file', () => {
    const dict = utils.loadJsonFile('bogus.blabla');
    expect(typeof dict === 'object' && dict.status === 'error').toBe(true);
  });

  it('finds file types in dictionary', () => {
    const dict = {
      experiment: { category: 'bla' },
      file1: { category: 'data_file' },
      file2: { category: 'data_file' },
      file3: { category: 'data_file' },
    };

    const info = helper.getGqlSetupFromDictionary(dict);
    expect(info.fileTypeList.length).toBe(3);
    expect(info.fileTypeList.sort()).toEqual(['file1', 'file2', 'file3']);
  });
});
