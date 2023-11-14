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

export const isEditable = Template.bind({});
isEditable.args = {
  isEditable: true,
};

export const notEditable = Template.bind({});
notEditable.args = {
  isEditable: false,
};
