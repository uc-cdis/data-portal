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
    { ageBin: '1-2', patients: 10000 },
    { ageBin: 4, patients: 500 },
    { ageBin: 3, patients: 12250 },
    { ageBin: 'bin 2', patients: 5000 },
    { ageBin: '1-2', patients: 10000 },
    { ageBin: 4, patients: 500 },
    { ageBin: 3, patients: 12250 },
    { ageBin: 'bin 2', patients: 5000 },
    { ageBin: '1-2', patients: 10000 },
    { ageBin: 4, patients: 500 },
    { ageBin: 3, patients: 12250 },
    { ageBin: 'bin 2', patients: 5000 },
    { ageBin: '1-2', patients: 10000 },
    { ageBin: 4, patients: 500 },
    { ageBin: 3, patients: 12250 },
    { ageBin: 'bin 2', patients: 5000 },
    ],
  xAxisDataKey: 'ageBin',
  barDataKey: 'patients',
  barColor: 'darkblue'
};

export const SecondStepError = Template.bind({});
SecondStepError.args = {
};
