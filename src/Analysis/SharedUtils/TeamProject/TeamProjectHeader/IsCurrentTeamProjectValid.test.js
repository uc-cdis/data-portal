import IsCurrentTeamProjectValid from './IsCurrentTeamProjectValid';
import TeamProjectTestData from '../TestData/TeamProjectTestData';

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
};

beforeEach(() => {
  jest.resetAllMocks();
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
  });
});

describe('IsCurrentTeamProjectValid', () => {
  it("should return false if data doesn't contain teams", () => {
    const result = IsCurrentTeamProjectValid({ notTeams: [] });
    expect(result).toBe(false);
  });

  it('should return false if current team project is not valid', () => {
    localStorageMock.getItem.mockReturnValue('InvalidTeamName');
    const result = IsCurrentTeamProjectValid(TeamProjectTestData.data);
    expect(result).toBe(false);
    expect(localStorageMock.getItem).toHaveBeenCalledWith('teamProject');
  });

  it('should return true if current team project is valid', () => {
    localStorageMock.getItem.mockReturnValue(
      TeamProjectTestData.data.teams[0].teamName
    );
    const result = IsCurrentTeamProjectValid(TeamProjectTestData.data);
    expect(result).toBe(true);
    expect(localStorageMock.getItem).toHaveBeenCalledWith('teamProject');
  });
});
