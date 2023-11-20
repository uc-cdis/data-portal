import React from 'react';
import {
  render, screen, fireEvent, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import TeamProjectModal from './TeamProjectModal';

// Mocking the useQuery hook
jest.mock('react-query');

const modalTestData = {
  teams: [
    {
      teamName: '/gwas_projects/project1',
    },
    {
      teamName: '/gwas_projects/project2',
    },
  ],
};
const testTeamName = modalTestData.teams[0].teamName;

const setIsModalOpen = jest.fn();
const setBannerText = jest.fn();
const setSelectedTeamProject = jest.fn();
localStorage.setItem('teamProject', testTeamName);

describe('TeamProjectModal', () => {
  test('renders with loading text initially', async () => {
    render(
      <TeamProjectModal
        isModalOpen
        setIsModalOpen={setIsModalOpen}
        setBannerText={setBannerText}
        data={undefined}
        status='loading'
        selectedTeamProject='/gwas_projects/project1'
        setSelectedTeamProject={setSelectedTeamProject}
      />,
    );

    expect(screen.getByText(/Please wait.../i)).toBeInTheDocument();
    expect(
      screen.getByText(/Retrieving the list of team projects./i),
    ).toBeInTheDocument();
  });

  test('Modal renders with expected components after successful load without team project local storage set', async () => {
    render(
      <TeamProjectModal
        isModalOpen
        setIsModalOpen={setIsModalOpen}
        setBannerText={setBannerText}
        data={modalTestData}
        status='success'
        selectedTeamProject={null}
        setSelectedTeamProject={setSelectedTeamProject}
      />,
    );

    await waitFor(() => screen.getByText(/Please select your team./i));
    expect(
      screen.getByText(/-select one of the team projects below-/i),
    ).toBeInTheDocument();

    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('Submit').closest('button')).toHaveAttribute(
      'disabled',
    );
  });

  test('Modal renders with expected content after successful load with team project local storage set', async () => {
    // Mocking the local storage variable

    render(
      <TeamProjectModal
        isModalOpen
        setIsModalOpen={setIsModalOpen}
        setBannerText={setBannerText}
        data={modalTestData}
        status='success'
        selectedTeamProject={testTeamName}
        setSelectedTeamProject={setSelectedTeamProject}
      />,
    );

    await waitFor(() => screen.getByText(/Please select your team./i));

    expect(() => screen.getByText('select one of the team projects below'),
    ).toThrow('Unable to find an element');
    expect(screen.getByText(testTeamName)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
    expect(screen.getByText('Submit').closest('button')).not.toHaveAttribute(
      'disabled',
    );
  });

  test('sets defaultValue text based on localstorage state, calls setBannerText and closes modal on submit button click', async () => {
    render(
      <TeamProjectModal
        isModalOpen
        setIsModalOpen={setIsModalOpen}
        setBannerText={setBannerText}
        data={modalTestData}
        status='success'
        selectedTeamProject={testTeamName}
        setSelectedTeamProject={setSelectedTeamProject}
      />,
    );

    await waitFor(() => screen.getByText(/Please select your team./i));
    fireEvent.click(screen.getByText(/Please select your team./i));
    const submitButton = screen.getByText(/Submit/i);
    fireEvent.click(submitButton);

    // Assert that the modal closes and sets banner text
    expect(setIsModalOpen).toHaveBeenCalledWith(false);
    expect(setBannerText).toHaveBeenCalledWith(testTeamName);
  });
});
