import RelayProjectDashboard from './RelayProjectDashboard';


describe('RelayProjectDashboard dashboard wrapper', () => {
  it('translates Relay container properties to component properties', () => {
    const relayProps = {
      projectList: [
        { name: 'Fred', experimentCount: 2 },
        { name: 'Mary', experimentCount: 3 },
      ],
      count1: 20,
      count2: 25,
      count3: 35,
      fileCount1: 10,
      fileCount2: 20,
      fileCount3: 30,
    };

    const { summaryCounts, projectList } = RelayProjectDashboard.transformRelayProps(relayProps);
    expect(typeof summaryCounts).toBe('object');
    expect(Array.isArray(projectList)).toBe(true);
    expect(summaryCounts).toEqual([20, 25, 35, 60]);
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
