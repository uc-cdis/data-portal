import { RelayProjectDashboard } from './RelayHomepage';


describe('RelayHomepage dashboard wrapper', () => {
  it('translates Relay container properties to component properties', () => {
    const relayProps = {
      projectList: [
        { name: 'Fred', experimentCount: 2 },
        { name: 'Mary', experimentCount: 3 },
      ],
      countOne: 20,
      countTwo: 25,
      fileCount1: 10,
      fileCount2: 20,
      fileCount3: 30,
      countThree: 35,
    };

    const { summaryCounts, projectList } = RelayProjectDashboard.transformRelayProps(relayProps);
    expect(typeof summaryCounts).toBe('object');
    expect(Array.isArray(projectList)).toBe(true);
    expect(summaryCounts.countThree).toBe(35);
    expect(summaryCounts.fileCount).toBe(60);
    expect(summaryCounts.countOne).toBe(20);
    expect(summaryCounts.countTwo).toBe(25);
    expect(projectList.length).toBe(2);
  });

  it('Updates redux', (done) => {
    const projectList = [
      {
        name: 'Lizzy',
        experimentCount: 3,
      },
      {
        name: 'Ozzy',
        experimentCount: 4,
      },
    ];
    RelayProjectDashboard.updateRedux({ projectList, statusCounts: {} }).then(
      (status) => {
        expect(status === 'dispatch' || status === 'NOOP').toBe(true);
        done();
      },
    );
  });
});
