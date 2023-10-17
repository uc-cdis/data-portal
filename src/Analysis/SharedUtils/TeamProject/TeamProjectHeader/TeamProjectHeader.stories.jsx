import React from 'react';
import TeamProjectHeader from './TeamProjectHeader';

export default {
  title: 'TESTS1/SharedUtils/TeamProjectHeader',
  component: TeamProjectHeader,
};

const Template = (args) => (
  <div className='GWASApp'>
    <TeamProjectHeader {...args} />
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
