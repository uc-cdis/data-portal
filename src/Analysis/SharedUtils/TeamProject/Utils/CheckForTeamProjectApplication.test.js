import CheckForTeamProjectApplication from './CheckForTeamProjectApplication';

describe('CheckForTeamProjectApplication', () => {
  it('should return true if the analysisApps contain an application where needsTeamProject is true', () => {
    const analysisApps = {
      'OHDSI Atlas': {
        needsTeamProject: true,
      },
      SomeOtherApp: {},
    };
    const result = CheckForTeamProjectApplication(analysisApps);
    expect(result).toBe(true);
  });

  it('should return false if the analysisApps do not contain any application where needsTeamProject is true', () => {
    const analysisApps = {
      SomeOtherApp: 1,
      AnotherApp: 2,
    };
    const result = CheckForTeamProjectApplication(analysisApps);
    expect(result).toBe(false);

    const analysisApps2 = {
      'OHDSI Atlas': {
        needsTeamProject: false,
      },
      AnotherApp: {
        needsTeamtypoProject: true,
        otherRandomAttribute: 'random',
      },
    };
    const result2 = CheckForTeamProjectApplication(analysisApps2);
    expect(result2).toBe(false);
  });

  it('should return false for an empty analysisApps object', () => {
    const analysisApps = {};
    const result = CheckForTeamProjectApplication(analysisApps);
    expect(result).toBe(false);
  });
});
