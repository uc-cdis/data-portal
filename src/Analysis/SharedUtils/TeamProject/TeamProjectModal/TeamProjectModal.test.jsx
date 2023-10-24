import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useQuery } from 'react-query';
import TeamProjectModal from './TeamProjectModal';

// Mocking the useQuery hook
jest.mock('react-query');

describe('TeamProjectModal', () => {
  test('renders with loading text initially', async () => {
    // Mocking the loading state
    useQuery.mockReturnValueOnce({ data: undefined, status: 'loading' });
    render(
      <TeamProjectModal
        isModalOpen={true}
        setIsModalOpen={() => {}}
        setBannerText={() => {}}
      />
    );

    expect(screen.getByText(/Please wait.../i)).toBeInTheDocument();
    expect(
      screen.getByText(/Retrieving the list of team projects./i)
    ).toBeInTheDocument();
  });

  test('Modal renders with expected components after successful load without team project local storage set', async () => {
    // Mocking the success state
    useQuery.mockReturnValueOnce({
      data: { teams: [{ value: 'selectedValue', label: 'Selected Value' }] },
      status: 'success',
    });

    const setIsModalOpen = jest.fn();
    const setBannerText = jest.fn();

    render(
      <TeamProjectModal
        isModalOpen={true}
        setIsModalOpen={setIsModalOpen}
        setBannerText={setBannerText}
      />
    );

    await waitFor(() => screen.getByText(/Please select your team./i));
    expect(
      screen.getByText(/-select one of the team projects below-/i)
    ).toBeInTheDocument();

    expect(screen.getByRole('combobox')).toBeInTheDocument();

    expect(() => screen.getByText('Submit')).toThrow(
      'Unable to find an element'
    );
  });

  test('Modal renders with expected content after successful load with team project local storage set', async () => {
    // Mocking the local storage variable
    localStorage.setItem('teamProject', 'test string');

    // Mocking the success state
    useQuery.mockReturnValueOnce({
      data: { teams: [{ value: 'selectedValue', label: 'Selected Value' }] },
      status: 'success',
    });

    const setIsModalOpen = jest.fn();
    const setBannerText = jest.fn();

    render(
      <TeamProjectModal
        isModalOpen={true}
        setIsModalOpen={setIsModalOpen}
        setBannerText={setBannerText}
      />
    );

    await waitFor(() => screen.getByText(/Please select your team./i));

    expect(() =>
      screen.getByText('select one of the team projects below')
    ).toThrow('Unable to find an element');
    expect(screen.getByText('test string')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText(/Submit/i)).toBeInTheDocument();
  });

  test('sets text based on localstorage state, calls setBannerText and closes modal on submit button click', async () => {
    // Mocking the local storage variable
    localStorage.setItem('teamProject', 'test string');

    // Mocking the success state
    useQuery.mockReturnValueOnce({
      data: { teams: [{ value: 'selectedValue', label: 'Selected Value' }] },
      status: 'success',
    });

    const setIsModalOpen = jest.fn();
    const setBannerText = jest.fn();

    render(
      <TeamProjectModal
        isModalOpen={true}
        setIsModalOpen={setIsModalOpen}
        setBannerText={setBannerText}
      />
    );

    await waitFor(() => screen.getByText(/Please select your team./i));
    fireEvent.click(screen.getByText(/Please select your team./i));
    const submitButton = screen.getByText(/Submit/i);
    fireEvent.click(submitButton);

    // Assert that the closeAndUpdateTeamProject function has been called
    expect(setIsModalOpen).toHaveBeenCalledWith(false);
    expect(setBannerText).toHaveBeenCalledWith('test string');
  });
});
