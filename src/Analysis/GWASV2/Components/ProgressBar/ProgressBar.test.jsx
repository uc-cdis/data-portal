import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ProgressBar from './ProgressBar';

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

const testElementClass = (currentStep, elNum, className) => {
  render(<ProgressBar currentStep={currentStep} selectionMode='continuous' />);
  const stepElements = screen.getAllByTestId('progress-bar-step');
  stepElements.forEach((item, index) => {
    if (index === elNum - 1) {
      expect(item).toHaveClass(className);
    } else {
      expect(item).not.toHaveClass(className);
    }
  });
};

/* TESTS /
/ Test active step class */
describe('Test that active step class renders with active class when current is between 0 and 3', () => {
  for (let i = 0; i < 4; i += 1) {
    it(`should render step ${i
      + 1} with active class when currentStep is ${i}`, () => {
      testElementClass(i, i + 1, 'ant-steps-item-active');
    });
  }
});
