import {RelayProjectDashboard} from './RelayHomepage.jsx';


describe( "RelayHomepage dashboard wrapper", function() {
  it( "translates Relay container properties to component properties", function() {
    const relayProps = {
      projectList: [
        { name: "Fred", experimentCount: 2 },
        { name: "Mary", experimentCount: 3 }
      ],
      caseCount:20,
      aliquotCount: 25,
      fileCount1: 10,
      fileCount2: 20,
      fileCount3: 30,
      experimentCount: 35
    };

    const { summaryCounts, projectList } = RelayProjectDashboard.transformRelayProps( relayProps );
    expect( typeof summaryCounts ).toBe( "object" );
    expect( Array.isArray( projectList ) ).toBe( true );
    expect( summaryCounts.experimentCount ).toBe( 35 );
    expect( summaryCounts.fileCount ).toBe( 60 );
    expect( summaryCounts.caseCount ).toBe( 20 );
    expect( summaryCounts.aliquotCount ).toBe( 25 );
    expect( projectList.length ).toBe( 2 );
  });

  it( "Updates redux", function(done) {
    const projectList = [
      {
        name: "Lizzy",
        experimentCount: 3
      },
      {
        name: "Ozzy",
        experimentCount: 4
      }
    ];
    RelayProjectDashboard.updateRedux( projectList ).then(
      (status) => {
        expect( status === "dispatch" || status === "NOOP" ).toBe( true );
        done();
      }
    );
  });
})