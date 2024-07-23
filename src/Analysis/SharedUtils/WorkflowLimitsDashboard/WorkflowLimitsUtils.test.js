import {
  fetchMonthlyWorkflowLimitInfo,
  workflowLimitInfoIsValid,
} from './WorkflowLimitsUtils';

describe('fetchMonthlyWorkflowLimitInfo function', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('fetches data successfully', async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ someKey: 'someValue' }), // Mock JSON response
    };
    global.fetch.mockResolvedValue(mockResponse);
    const result = await fetchMonthlyWorkflowLimitInfo();
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ someKey: 'someValue' });
  });

  test('throws an error when fetch fails', async () => {
    const mockErrorResponse = {
      ok: false,
      status: 404,
      statusText: 'Not Found',
    };
    global.fetch.mockResolvedValue(mockErrorResponse);
    await expect(fetchMonthlyWorkflowLimitInfo()).rejects.toThrow(
      'An error has occurred: 404',
    );
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});

describe('workflowLimitInfoIsValid function', () => {
  test('returns false when not an object', async () => {
    expect(workflowLimitInfoIsValid('string')).toEqual(false);
  });
  test('returns false when keys are not workflow_run and workflow_limit', async () => {
    expect(workflowLimitInfoIsValid({ invalidKey: 1 })).toEqual(false);
  });
  test('returns false when keys are not numeric', async () => {
    expect(
      workflowLimitInfoIsValid({ workflow_run: 'string', workflow_limit: [] }),
    ).toEqual(false);
  });
  test('returns false when workflow_limit is zero', async () => {
    expect(
      workflowLimitInfoIsValid({ workflow_run: 1, workflow_limit: 0 }),
    ).toEqual(false);
  });
  test('returns false when workflow_limit is negative', async () => {
    expect(
      workflowLimitInfoIsValid({ workflow_run: 1, workflow_limit: -1 }),
    ).toEqual(false);
  });
  test('returns false when workflow_limit or workflow_run are missing', async () => {
    expect(
      workflowLimitInfoIsValid({ workflow_run: 1 }),
    ).toEqual(false);
    expect(
      workflowLimitInfoIsValid({ workflow_limit: 1 }),
    ).toEqual(false);
  });
  test('returns true when keys are correct and numeric', async () => {
    expect(
      workflowLimitInfoIsValid({ workflow_run: 1, workflow_limit: 2 }),
    ).toEqual(true);
  });
});
