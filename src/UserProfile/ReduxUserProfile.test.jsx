import { Provider } from 'react-redux';
import fetchMock from 'jest-fetch-mock';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import popupsReducer from '../redux/popups/slice';
import statusReducer from '../redux/status/slice';
import userReducer from '../redux/user/slice';
import userProfileReducer from '../redux/userProfile/slice';
import ReduxUserProfile from './ReduxUserProfile';

const { mockResponseOnce } = fetchMock;
const expectedData = {
  key_id: 'f8733984-8164-4689-9c25-56707962d7e0',
  api_key: 'some_key',
};
const jtis = [
  {
    jti: 'f8733984-8164-4689-9c25-56707962d7e0',
    exp: 1459487258,
  },
];

const mockStore = configureStore({
  preloadedState: {
    user: { username: 'test@test.com', project_access: [] },
    userProfile: { jtis: [] },
  },
  reducer: {
    popups: popupsReducer,
    status: statusReducer,
    user: userReducer,
    userProfile: userProfileReducer,
  },
});

test('creates, fetches, and lists user access keys', async () => {
  mockResponseOnce(JSON.stringify(expectedData), { status: 200 });
  mockResponseOnce(JSON.stringify({ jtis }), { status: 200 });
  const { container, getAllByRole, getByText } = render(
    <Provider store={mockStore}>
      <ReduxUserProfile />
    </Provider>
  );
  const createButtonElement = getByText('Create API key');
  expect(createButtonElement).toBeInTheDocument();

  fireEvent.click(createButtonElement);
  await waitFor(() => {
    const popupElement = container.querySelector('.popup__mask');
    expect(popupElement).toBeInTheDocument();
    expect(
      getByText('This secret key is only displayed this time. Please save it!')
    ).toBeInTheDocument();
    expect(getByText(expectedData.key_id)).toBeInTheDocument();
  });

  const closePopupButtonElement = getByText('Close');
  expect(closePopupButtonElement).toBeInTheDocument();

  fireEvent.click(closePopupButtonElement);
  expect(container.querySelector('.popup__mask')).not.toBeInTheDocument();
  expect(getByText('You have the following API key(s)')).toBeInTheDocument();
  expect(getAllByRole('row')).toHaveLength(2); // 2 rows including header
  expect(getByText(expectedData.key_id)).toBeInTheDocument();
});

test('deletes key', async () => {
  mockResponseOnce(null);
  mockResponseOnce(JSON.stringify({ exp: jtis[0].exp }), { status: 204 });
  mockResponseOnce(JSON.stringify({ jtis: [] }), { status: 200 });

  const { container, getByText } = render(
    <Provider store={mockStore}>
      <ReduxUserProfile />
    </Provider>
  );

  const deleteButtonElement = getByText('Delete');
  expect(deleteButtonElement).toBeInTheDocument();

  fireEvent.click(deleteButtonElement);
  const popupElement = container.querySelector('.popup__mask');
  expect(popupElement).toBeInTheDocument();
  expect(getByText('Inactivate API Key')).toBeInTheDocument();

  const confirmButtonElement = getByText('Confirm');
  expect(confirmButtonElement).toBeInTheDocument();

  fireEvent.click(confirmButtonElement);

  fireEvent.click(confirmButtonElement);
  await waitFor(() => {
    expect(confirmButtonElement).not.toBeInTheDocument();
    expect(deleteButtonElement).not.toBeInTheDocument();
  });
});
