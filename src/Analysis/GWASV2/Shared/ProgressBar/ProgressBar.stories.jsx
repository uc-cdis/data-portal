import React, { useState } from "react";
import ProgressBar from "./ProgressBar";

export default {
  title: "Tests3/GWASV2/ProgressBar",
  component: ProgressBar,
};

const Template = (args) => <ProgressBar {...args} />;

export const FirstStepActive = Template.bind({});
FirstStepActive.args = {
  current: 0,
};

export const SecondStepActive = Template.bind({});
SecondStepActive.args = {
  current: 1,
};

export const ThirdStepActive = Template.bind({});
ThirdStepActive.args = {
  current: 2,
};

export const FourthStepActive = Template.bind({});
FourthStepActive.args = {
  current: 3,
};
