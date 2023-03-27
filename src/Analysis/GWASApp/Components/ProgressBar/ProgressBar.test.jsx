import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import ProgressBar from './ProgressBar';

const testElementClass = (currentStep, className) => {
  render(<ProgressBar currentStep={currentStep} selectionMode='continuous' />);
  const stepElements = screen.getAllByTestId('progress-bar-step');
  stepElements.forEach((item, index) => {
    if (index === currentStep) {
      expect(item).toHaveClass(className);
    } else {
      expect(item).not.toHaveClass(className);
    }
  });
};

/* TESTS */
/* Test active step class */
describe('Test that active step class renders with active class when current is between 0 and 3', () => {
  for (let i = 0; i < 4; i += 1) {
    it(`should render step ${i +
      1} with active class when currentStep is ${i}`, () => {
      testElementClass(i, 'ant-steps-item-active');
    });
  }
});
