import DownloadDataFiles from './DownloadDataFiles';
import CheckFederatedLoginStatus from './CheckFederatedLoginStatus';
import { fetchWithCreds } from '../../../../../../../../../actions';
import { INITIAL_DOWNLOAD_STATUS } from '../Constants';

jest.mock('./CheckFederatedLoginStatus', () => jest.fn());
jest.mock('../../../../../../../../../actions', () => ({ fetchWithCreds: jest.fn() }));
jest.mock('../../../../../../../../../localconf', () => ({ jobAPIPath: '/job/' }));

const mockedCheckFederatedLoginStatus = CheckFederatedLoginStatus as jest.Mock;
const mockedFetchWithCreds = fetchWithCreds as jest.Mock;

const callDownloadDataFiles = (
  setDownloadStatus: jest.Mock,
  { verifyExternalLoginsNeeded = true, missingRequiredIdentityProviders = [] as string[] } = {},
) => DownloadDataFiles(
  INITIAL_DOWNLOAD_STATUS,
  setDownloadStatus,
  {} as any,
  {} as any,
  missingRequiredIdentityProviders,
  verifyExternalLoginsNeeded,
  [{ object_id: 'dg.TEST/1234' }],
  [],
  'mock_filename',
  {} as any,
);

afterEach(() => {
  jest.clearAllMocks();
});

describe('DownloadDataFiles', () => {
  test('marks the download as in progress while the federated login status is being checked', async () => {
    let resolveIsLinked;
    mockedCheckFederatedLoginStatus.mockReturnValue(new Promise((resolve) => { resolveIsLinked = resolve; }));
    const setDownloadStatus = jest.fn();

    const download = callDownloadDataFiles(setDownloadStatus);
    // the check has not returned yet, but the download is already marked as in progress
    expect(setDownloadStatus).toHaveBeenCalledTimes(1);
    expect(setDownloadStatus).toHaveBeenCalledWith({ ...INITIAL_DOWNLOAD_STATUS, inProgress: 'DownloadDataFiles' });
    expect(mockedFetchWithCreds).not.toHaveBeenCalled();

    // CheckFederatedLoginStatus resets the status itself when the user is not linked
    resolveIsLinked(false);
    await download;
    expect(setDownloadStatus).toHaveBeenCalledTimes(1);
    expect(mockedFetchWithCreds).not.toHaveBeenCalled();
  });

  test('resets the download status if the user is missing required identity providers', async () => {
    const setDownloadStatus = jest.fn();
    await callDownloadDataFiles(setDownloadStatus, {
      verifyExternalLoginsNeeded: false,
      missingRequiredIdentityProviders: ['mockIdP'],
    });
    expect(setDownloadStatus.mock.calls).toEqual([
      [{ ...INITIAL_DOWNLOAD_STATUS, inProgress: 'DownloadDataFiles' }],
      [INITIAL_DOWNLOAD_STATUS],
    ]);
    expect(mockedFetchWithCreds).not.toHaveBeenCalled();
  });

  test('dispatches the batch export job once the checks pass', async () => {
    mockedCheckFederatedLoginStatus.mockResolvedValue(true);
    mockedFetchWithCreds.mockReturnValue(new Promise(() => {})); // job dispatch still pending
    const setDownloadStatus = jest.fn();
    await callDownloadDataFiles(setDownloadStatus);
    expect(mockedFetchWithCreds).toHaveBeenCalledWith(expect.objectContaining({ path: '/job/dispatch', method: 'POST' }));
    // still in progress while waiting for the job to be dispatched
    expect(setDownloadStatus.mock.calls).toEqual([
      [{ ...INITIAL_DOWNLOAD_STATUS, inProgress: 'DownloadDataFiles' }],
    ]);
  });
});
