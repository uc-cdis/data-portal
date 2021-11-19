import React from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { fireEvent, render, screen } from '@testing-library/react';
import UserProfile from './UserProfile';

const testProps = {
  userInformation: {
    email: 'test@test.com',
  },
  userProfile: {
    jtis: [
      { jti: 'f8733984-8164-4689-9c25-56707962d7e0', exp: 1459487258 },
      { jti: 'f8733984-8164-4689-9c25-56707962d7e9', exp: 1459487259 },
    ],
  },
  popups: {},
};

const mockStore = configureMockStore()({});
const noop = () => {};

test('lists access keys', () => {
  const { container } = render(
    <Provider store={mockStore}>
      <UserProfile
        {...testProps}
        onCreateKey={noop}
        onClearCreationSession={noop}
        onUpdatePopup={noop}
        onDeleteKey={noop}
        onRequestDeleteKey={noop}
        onClearDeleteSession={noop}
      />
    </Provider>
  );
  expect(container.querySelectorAll('tbody tr')).toHaveLength(
    testProps.userProfile.jtis.length
  );
});

test('triggers create key events', () => {
  const onCreateKey = jest.fn();
  render(
    <Provider store={mockStore}>
      <UserProfile
        {...testProps}
        onCreateKey={onCreateKey}
        onClearCreationSession={noop}
        onUpdatePopup={noop}
        onDeleteKey={noop}
        onRequestDeleteKey={noop}
        onClearDeleteSession={noop}
      />
    </Provider>
  );
  const createButtonElement = screen.getByText('Create API key');
  expect(createButtonElement).toBeInTheDocument();

  fireEvent.click(createButtonElement);
  expect(onCreateKey).toHaveBeenCalled();
});

test('triggers request delete key events', () => {
  const onRequestDeleteKey = jest.fn();
  render(
    <Provider store={mockStore}>
      <UserProfile
        {...testProps}
        onCreateKey={noop}
        onClearCreationSession={noop}
        onUpdatePopup={noop}
        onDeleteKey={noop}
        onRequestDeleteKey={onRequestDeleteKey}
        onClearDeleteSession={noop}
      />
    </Provider>
  );
  const deleteButtonElement = screen.getAllByText('Delete')[0];
  expect(deleteButtonElement).toBeInTheDocument();

  fireEvent.click(deleteButtonElement);
  expect(onRequestDeleteKey).toHaveBeenCalled();
});
