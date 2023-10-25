import CheckForTeamProjectApplication from './CheckForTeamProjectApplication';

describe('CheckForTeamProjectApplication', () => {
  it('should return true if the analysisApps contain a team project application', () => {
    const analysisApps = {
      'OHDSI Atlas': 1,
      'SomeOtherApp': 2,
    };
    const result = CheckForTeamProjectApplication(analysisApps);
    expect(result).toBe(true);
  });

  it('should return false if the analysisApps do not contain any team project application', () => {
    const analysisApps = {
      'SomeOtherApp': 1,
      'AnotherApp': 2,
    };
    const result = CheckForTeamProjectApplication(analysisApps);
    expect(result).toBe(false);
  });

  it('should return false for an empty analysisApps object', () => {
    const analysisApps = {};
    const result = CheckForTeamProjectApplication(analysisApps);
    expect(result).toBe(false);
  });
});
