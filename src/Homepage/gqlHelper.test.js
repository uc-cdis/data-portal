import {GQLHelper} from './gqlHelper.js';

/**
 * Note - these test will fail if the local dictionary
 * is not an 'experiment' dictionary as the Relay.QL
 * validation will kick in once we allocate a fragment.
 */
describe( "the gqlHelper", function() {
  const helper = GQLHelper.getGQLHelper( "exp" );

  it( "provides different helpers for different apps", function() {
    const studyHelper = GQLHelper.getGQLHelper( "bhc" );
    expect( studyHelper ).not.toBe( helper );   
  })
  it( "provides a base numFilesTotal fragment", function() {
    const frag = helper.numFilesTotalFragment;

    expect( !! frag ).toBe(true);
  });


  it( "provides a base numFilesByProject fragment", function() {
    const frag = helper.numFilesByProjectFragment;

    expect( !! frag ).toBe(true);
  });

  it( "caches fragments", function() {
    const frag1 = helper.projectDashboardFragment;
    expect( frag1 ).toBeDefined();
    expect( helper.projectDashboardFragment ).toBe( frag1 );
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