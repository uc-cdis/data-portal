import React, { useState } from 'react';
import Histogram from './Histogram';

export default {
  title: "Tests3/GWASV2/Histogram_Recharts",
  component: Histogram,
};

const Template = (args) => <Histogram {...args} />;

export const FirstStepActive = Template.bind({});
FirstStepActive.args = {
  data: [
    { quarter: 1, earnings: 10000 },
    { quarter: 4, earnings: 500 },
    { quarter: 3, earnings: 12250 },
    { quarter: 2, earnings: 5000 },
  ]
};

export const SecondStepError = Template.bind({});
SecondStepError.args = {
};
