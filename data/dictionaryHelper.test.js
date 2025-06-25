const helper = require('./dictionaryHelper.js');

describe('the dictionaryHelper', () => {
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
