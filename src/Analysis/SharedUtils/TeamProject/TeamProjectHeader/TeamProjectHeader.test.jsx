import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import '@testing-library/jest-dom';
import TeamProjectHeader from './TeamProjectHeader';

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};

beforeEach(() => {
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
  });
});

test('renders TeamProjectHeader with default props', () => {
  localStorageMock.getItem.mockReturnValueOnce(null);
  render(
    <QueryClientProvider client={new QueryClient()} contextSharing>
      <TeamProjectHeader />
    </QueryClientProvider>,
  );
  // Assert that the component renders without crashing without button
  expect(screen.getByText('Team Project')).toBeInTheDocument();
  expect(screen.getByText('/ - -')).toBeInTheDocument();
});

test('renders TeamProjectHeader with edit button when showButton is true', () => {
  render(
    <QueryClientProvider client={new QueryClient()} contextSharing>
      <TeamProjectHeader showButton />
    </QueryClientProvider>,
  );

  // Assert that the component renders with the edit button
  expect(screen.queryByTestId('team-project-edit')).toBeInTheDocument();

  // Simulate a click on the edit button and assert that the modal opens
  fireEvent.click(screen.queryByTestId('team-project-edit'));
  expect(screen.getByText('Team Projects')).toBeInTheDocument();

  // Close the modal and check that it is not visible
  fireEvent.click(screen.getByText('Submit'));
  expect(screen.getByRole('dialog', { hidden: true }));
});

test('Renders project name based on local storage value', () => {
  // Set up a mock value for localStorage.getItem('teamProject')
  const teamProjectValue = 'Mock Team Project Name';
  localStorageMock.getItem.mockReturnValueOnce(teamProjectValue);
  render(
    <QueryClientProvider client={new QueryClient()} contextSharing>
      <TeamProjectHeader />
    </QueryClientProvider>,
  );
  // Assert that the component renders with the banner text from localStorage
  expect(screen.getByText(`/ ${teamProjectValue}`)).toBeInTheDocument();
});
