import React, { useState } from 'react';
import Simple3GroupsEulerDiagram from './Simple3SetsEulerDiagram';

export default {
  title: "Tests3/GWASV2/EulerDiagram",
  component: Simple3GroupsEulerDiagram,
};

const Template = (args) => <Simple3GroupsEulerDiagram {...args} />;

export const FirstStepActive = Template.bind({});
FirstStepActive.args = {
  set1Size: 1000,
  set2Size: 900,
  set3Size: 4000,
  set12Size: 100,
  set13Size: 200,
  set23Size: 300,
  set123Size: 123,
};

// Test whether we get an error when the overlap size is bigger than the group size:
export const SecondStepError = Template.bind({});
SecondStepError.args = {
  set1Size: 1000,
  set2Size: 900,
  set3Size: 4000,
  set12Size: 100,
  set13Size: 20000, // impossible overlap
  set23Size: 300,
  set123Size: 123,
};
