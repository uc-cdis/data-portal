import React from 'react';
import TeamProjectModal from './TeamProjectModal';
import { QueryClient, QueryClientProvider } from 'react-query';
import TeamProjectTestData from '../TestData/TeamProjectTestData';

export default {
  title: 'TESTS1/SharedUtils/TeamProjectModal',
  component: TeamProjectModal,
};

const mockedQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const Template = (args) => (
  <div className='GWASApp'>
    <QueryClientProvider client={mockedQueryClient} contextSharing>
      <TeamProjectModal {...args} />
    </QueryClientProvider>
  </div>
);

const successArgs = {
  isModalOpen: true,
  setIsModalOpen: () => null,
  setBannerText: () => null,
  data: TeamProjectTestData.data,
  status: 'success',
  selectedTeamProject: TeamProjectTestData.data.teams[0].teamName,
  setSelectedTeamProject: () => null,
};

export const MockedSuccess = Template.bind({});
MockedSuccess.args = successArgs;

export const MockedLoading = Template.bind({});
MockedLoading.args = { ...successArgs, status: 'loading', data: null };

export const MockedError = Template.bind({});
MockedError.args = { ...successArgs, status: 'error', data: null };
