// Import the function
import IsCurrentTeamProjectValid from './IsCurrentTeamProjectValid';

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

// Sample data for testing
const sampleData = {
  teams: [
    { teamName: 'TeamA' },
    { teamName: 'ValidTeamName' },
    { teamName: 'TeamC' },
  ],
};

describe('IsCurrentTeamProjectValid', () => {
  it(`should return false if data doesn't contain teams`, () => {
    const result = IsCurrentTeamProjectValid({ notTeams: [] });
    expect(result).toBe(false);
  });

  it('should return false if current team project is not valid', () => {
    localStorageMock.getItem.mockReturnValue('InvalidTeamName');
    const result = IsCurrentTeamProjectValid(sampleData);
    expect(result).toBe(false);
    expect(localStorageMock.getItem).toHaveBeenCalledWith('teamProject');
  });

  it('should return true if current team project is valid', () => {
    localStorageMock.getItem.mockReturnValue('ValidTeamName');
    const result = IsCurrentTeamProjectValid(sampleData);
    expect(result).toBe(true);
    expect(localStorageMock.getItem).toHaveBeenCalledWith('teamProject');
  });
});
