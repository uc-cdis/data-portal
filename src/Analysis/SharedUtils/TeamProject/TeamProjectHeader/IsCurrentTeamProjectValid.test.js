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
    // Call the function with sample data
    const result = IsCurrentTeamProjectValid({ notTeams: [] });
    // Expect the result to be false
    expect(result).toBe(false);
  });
  it(`should return false if data is falsy`, () => {
    // Call the function with sample data
    const result = IsCurrentTeamProjectValid(null);
    // Expect the result to be false
    expect(result).toBe(false);
  });

  it('should return false if current team project is not valid', () => {
    // Mock localStorage.getItem to return an invalid team project
    localStorageMock.getItem.mockReturnValue('InvalidTeamName');

    // Call the function with sample data
    const result = IsCurrentTeamProjectValid(sampleData);

    // Expect the result to be false
    expect(result).toBe(false);

    // Expect localStorage.getItem to have been called with the correct argument
    expect(localStorageMock.getItem).toHaveBeenCalledWith('teamProject');
  });
  it('should return true if current team project is valid', () => {
    localStorageMock.getItem.mockReturnValue('ValidTeamName');
    // Call the function with sample data
    const result = IsCurrentTeamProjectValid(sampleData);
    // Expect the result to be true
    expect(result).toBe(true);
    // Expect localStorage.getItem to have been called with the correct argument
    expect(localStorageMock.getItem).toHaveBeenCalledWith('teamProject');
  });
});
