import React, { useState } from 'react';
import ProgressBar from './ProgressBar';

export default {
  title: 'Tests3/GWASApp/ProgressBar',
  component: ProgressBar,
};

const Template = (args) => <ProgressBar {...args} />;

export const FirstStepActive = Template.bind({});
FirstStepActive.args = {
  currentStep: 0,
};

export const SecondStepActive = Template.bind({});
SecondStepActive.args = {
  currentStep: 1,
};

export const ThirdStepActive = Template.bind({});
ThirdStepActive.args = {
  currentStep: 2,
};

export const FourthStepActive = Template.bind({});
FourthStepActive.args = {
  currentStep: 3,
};
