const helper = require('./dictionaryHelper.js');

describe("the dictionaryHelper", function () {
  it("knows how to load a json file", function () {
    const dict = helper.loadJsonFile(__dirname + "/dictionary.json");
    expect( dict.status ).toBe( "ok" );
    expect(dict.data.hasOwnProperty("_definitions")).toBe(true);
    // currently only support 'experiment' or 'study' type dictionaries
    expect(dict.data.hasOwnProperty("experiment") || dict.hasOwnProperty("study")).toBe(true);
  });

  it("returns empty object if cannot load/parse json file", function () {
    const dict = helper.loadJsonFile("bogus.blabla");
    expect(typeof dict === "object" && dict.status === "error" ).toBe(true);
  });

  it("identifies experiment-type dictionaries", function () {
    const info = helper.dictToGQLSetup({ experiment: {} });
    expect(info.experimentType).toBe("experiment");
    expect(info.fileTypeList.length).toBe(0);
  });

  it("identifies study-type dictionaries", function () {
    const info = helper.dictToGQLSetup({ study: {} });
    expect(info.experimentType).toBe("study");
    expect(info.fileTypeList.length).toBe(0);
  });

  it("finds file types in dictionary", function () {
    const dict = {
      experiment: { category: "bla" },
      file1: { category: "data_file" },
      file2: { category: "data_file" },
      file3: { category: "data_file" }
    };

    const info = helper.dictToGQLSetup(dict);
    expect(info.experimentType).toBe("experiment");
    expect(info.fileTypeList.length).toBe(3);
    expect(info.fileTypeList.sort()).toEqual(["file1", "file2", "file3"]);
  });
});
