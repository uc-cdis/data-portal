import { GQLHelper } from './gqlHelper';

/**
 * Note - these test will fail if the local dictionary
 * is not an 'experiment' dictionary as the Relay.QL
 * validation will kick in once we allocate a fragment.
 */
describe('the gqlHelper', () => {
  const helper = GQLHelper.getGQLHelper();

  it('provides a base homepageQuery', () => {
    const query = helper.homepageQuery;

    expect(!!query).toBe(true);
  });


  it('provides a base projectDetail query', () => {
    const query = helper.projectDetailQuery;

    expect(!!query).toBe(true);
  });

  it('caches properties', () => {
    const frag1 = helper.projectDetailQuery;
    expect(frag1).toBeDefined();
    expect(helper.projectDetailQuery).toBe(frag1);
  });

  it('accumulates fileCount and fileData results', () => {
    const testData = {
      fileCount1: 1,
      fileCount2: 2,
      fileCount3: 3,
      fileData1: [1],
      fileData2: [1, 2],
      fileData3: [1, 2, 3],
    };

    const { fileCount, fileData } = GQLHelper.extractFileInfo(testData);
    expect(fileCount).toBe(6);
    expect(fileData.length).toBe(6);
    expect(fileData.reduce((acc, it) => acc + it, 0)).toBe(10);
  });
});
