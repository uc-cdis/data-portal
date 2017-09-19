import {GQLHelper} from './gqlHelper.js';

/**
 * Note - these test will fail if the local dictionary
 * is not an 'experiment' dictionary as the Relay.QL
 * validation will kick in once we allocate a fragment.
 */
describe( "the gqlHelper", function() {
  const helper = GQLHelper.getGQLHelper();

  it( "support BHC dictionary", function() {
    const bhcHelper = GQLHelper.getGQLHelper( "bhc" );
    expect( bhcHelper ).toBe( helper );
  });

  it( "provides a base homepageQuery", function() {
    const query = helper.homepageQuery;

    expect( !! query ).toBe(true);
  });


  it( "provides a base projectDetailDetail query", function() {
    const query = helper.projectDetailQuery;

    expect( !! query ).toBe(true);
  });

  it( "caches properties", function() {
    const frag1 = helper.projectDetailQuery;
    expect( frag1 ).toBeDefined();
    expect( helper.projectDetailQuery ).toBe( frag1 );
  })

  it( "accumulates fileCount and fileData results", function() {
    const testData = {
      fileCount1:1,
      fileCount2:2,
      fileCount3:3,
      fileData1: [ 1 ],
      fileData2: [ 1, 2 ],
      fileData3: [ 1, 2, 3 ]
    };

    const { fileCount, fileData } = GQLHelper.extractFileInfo( testData );
    expect( fileCount ).toBe( 6 );
    expect( fileData.length ).toBe( 6 );
    expect( fileData.reduce( (acc,it) => acc+it, 0 ) ).toBe( 10 );
  });
})