import React from 'react';
import TeamProjectHeader from './TeamProjectHeader';
import { QueryClient, QueryClientProvider } from 'react-query';

export default {
  title: 'TESTS1/SharedUtils/TeamProjectHeader',
  component: TeamProjectHeader,
};

const Template = (args) => (
  <div className='GWASApp'>
    <QueryClientProvider client={new QueryClient()} contextSharing>
      <TeamProjectHeader {...args}/>
    </QueryClientProvider>,
  </div>
);

export const withButton = Template.bind({});
withButton.args = {
  showButton: true,
};

export const withNoButton = Template.bind({});
withNoButton.args = {
  showButton: false,
};
