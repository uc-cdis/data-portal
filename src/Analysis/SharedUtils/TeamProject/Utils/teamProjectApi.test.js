import fetchArboristTeamProjectRoles from './teamProjectApi';
import { authzMappingPath } from '../../../../configs';

// Mocking the fetch function
global.fetch = jest.fn();

describe('fetchArboristTeamProjectRoles', () => {
  beforeEach(() => {
    // Clear the mock function calls and reset any mock implementation
    jest.clearAllMocks();
  });

  it('fetches and returns team project roles successfully', async () => {
    // Define the expected response data
    const mockResponse = {
      '/gwas_projects/project1': { abc: 'def' },
      '/gwas_projects/project2': { abc: 'def' },
      '/ohter/project3': { abc: 'def' },
    };

    // Mock the fetch function to return a successful response with the expected data
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => mockResponse,
    });

    // Call the function and assert the result
    const result = await fetchArboristTeamProjectRoles();

    expect(result).toEqual({
      teams: [
        { teamName: '/gwas_projects/project1' },
        { teamName: '/gwas_projects/project2' },
      ],
    });

    // Ensure that fetch was called with the correct URL
    expect(global.fetch).toHaveBeenCalledWith(authzMappingPath);
  });

  it('throws an error when fetch fails', async () => {
    // Mock the fetch function to return an error response
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    // Call the function and expect it to throw an error
    await expect(fetchArboristTeamProjectRoles()).rejects.toThrow(
      'Network error',
    );

    // Ensure that fetch was called with the correct URL
    expect(global.fetch).toHaveBeenCalledWith(authzMappingPath);
  });
});
