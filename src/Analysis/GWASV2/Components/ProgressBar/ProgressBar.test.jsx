import React from 'react';
import Enzyme, { render, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ProgressBar from './ProgressBar';
import { gwasV2Steps } from '../../Shared/constants';

Enzyme.configure({ adapter: new Adapter() });

/*
  Code to aid in Jest Mocking, see:
  https://stackoverflow.com/questions/39830580/jest-test-fails-typeerror-window-matchmedia-is-not-a-function
*/
window.matchMedia = window.matchMedia
  || function () {
    return {
      matches: false,
      addListener() {},
      removeListener() {},
    };
  };

/* HELPER METHODS */
const testElementText = (wrapper, elNum, text) => {
  const testElement = wrapper.find(`div.ant-steps-item:nth-child(${elNum})`);
  expect(testElement).toHaveLength(1);
  expect(testElement.text()).toEqual(text);
};

const testElementClass = (wrapper, elNum, className) => {
  /*
    Enzyme has problems using Selectors, work around from:
    https://stackoverflow.com/questions/56145868/how-to-test-all-children-from-a-selector-except-the-first-child-in-jest
  */
  wrapper.find('div.ant-steps-item').forEach((item, index) => {
    if (index === elNum - 1) {
      expect(item.hasClass(className)).toEqual(true);
    } else {
      expect(item.hasClass(className)).toEqual(false);
    }
  });
};

/* TESTS */
/* Test active step class */
describe('Test that active step class renders with active class when current is between 0 and 3', () => {
  for (let i = 0; i < 4; i += 1) {
    const wrapper = mount(<ProgressBar currentStep={i} />);
    it(`should render step ${i
      + 1} with active class when currentStep is ${i}`, () => {
      testElementClass(wrapper, i + 1, 'ant-steps-item-active');
    });
  }
});
