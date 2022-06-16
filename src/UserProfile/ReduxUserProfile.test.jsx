import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import fetchMock from 'jest-fetch-mock';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ReduxUserProfile from './ReduxUserProfile';
import {
  clearDeleteKeySession,
  createSucceeded,
  deleteKeySucceeded,
  receiveUserProfile,
} from './actions';
import { createKey, deleteKey } from './actions.thunk';

const { mockResponseOnce } = fetchMock;
const expectedData = {
  key_id: 'f8733984-8164-4689-9c25-56707962d7e0',
  api_key: {
    sub: '1234567',
    iss: 'dcfauth:56fc3842ccf2c1c7ec5c5d14',
    iat: 1459458458,
    exp: 1459487258,
    jti: 'f8733984-8164-4689-9c25-56707962d7e0',
    aud: ['refresh'],
    azp: 'nIBmveVwqw0GNImXkIUwYD4uBg1Rnc98QlWLMm06',
    access_aud: ['user'],
    context: {
      user: {
        name: 'NIH_USERNAME',
        projects: {
          phs000178: ['member'],
          phs000218: ['member', 'submitter'],
        },
        email: 'user@university.edu',
      },
    },
  },
};
const { jti, exp } = expectedData.api_key;

function getMockStore() {
  return configureMockStore([thunk])({
    user: { username: 'test@test.com', project_access: [] },
    status: {},
    userProfile: { jtis: [] },
    popups: {},
  });
}

test('creates, fetches, and lists user access keys', (done) => {
  mockResponseOnce(JSON.stringify(expectedData), { status: 200 });
  mockResponseOnce(JSON.stringify({ jtis: [{ jti, exp }] }), { status: 200 });

  const mockStore = getMockStore();
  render(
    <Provider store={mockStore}>
      <ReduxUserProfile />
    </Provider>
  );
  const createButtonElement = screen.getByText('Create API key');
  expect(createButtonElement).toBeInTheDocument();

  fireEvent.click(createButtonElement);
  waitFor(() => {
    // Note that mock-store does not register reducers, so UI does not update,
    // but can check for expected actions
    expect(mockStore.getActions()).toEqual([
      createSucceeded({
        refreshCred: expectedData,
        strRefreshCred: JSON.stringify(expectedData, null, '\t'),
      }),
      {
        type: 'UPDATE_POPUP',
        payload: { saveTokenPopup: true },
      },
      receiveUserProfile([{ jti, exp }]),
    ]);
    done();
  });
});

test('updates the redux store', (done) => {
  mockResponseOnce(JSON.stringify(expectedData), { status: 200 });
  mockResponseOnce(JSON.stringify({ jtis: [{ jti, exp }] }), { status: 200 });

  const mockStore = getMockStore();
  /** @type {import('redux-thunk').ThunkDispatch} */ (mockStore.dispatch)(
    createKey('http://anything.com')
  );

  waitFor(() => {
    expect(mockStore.getActions()).toEqual([
      createSucceeded({
        refreshCred: expectedData,
        strRefreshCred: JSON.stringify(expectedData, null, '\t'),
      }),
      {
        type: 'UPDATE_POPUP',
        payload: { saveTokenPopup: true },
      },
      receiveUserProfile([{ jti, exp }]),
    ]);
    done();
  });
});

test('deletes key', (done) => {
  mockResponseOnce(JSON.stringify({ exp }), { status: 204 });
  mockResponseOnce(JSON.stringify({ jtis: [] }), { status: 200 });

  const mockStore = getMockStore();
  /** @type {import('redux-thunk').ThunkDispatch} */ (mockStore.dispatch)(
    deleteKey(jti, exp, 'test.com/action=delete')
  );
  waitFor(() => {
    expect(mockStore.getActions()).toEqual([
      deleteKeySucceeded(),
      clearDeleteKeySession(),
      {
        type: 'UPDATE_POPUP',
        payload: { deleteTokenPopup: false },
      },
      receiveUserProfile([]),
    ]);
    done();
  });
});
