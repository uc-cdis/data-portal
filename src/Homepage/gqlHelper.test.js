import {GQLHelper} from './gqlHelper.js';

describe( "the gqlHelper", function() {
  const helper = new GQLHelper( null );

  it( "provides a base numFilesTotal fragment", function() {
    const frag = helper.numFilesTotalFragment;

    expect( !! frag ).toBe(true);
  });


  it( "provides a base numFilesByProject fragment", function() {
    const frag = helper.numFilesByProjectFragment;

    expect( !! frag ).toBe(true);
  });

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