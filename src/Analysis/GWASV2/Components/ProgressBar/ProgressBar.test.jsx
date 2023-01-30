import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ProgressBar from './ProgressBar';

/*
Use this for debugging:
screen.debug()
*/

/*
  Code to aid in Jest Mocking, see:
  https://stackoverflow.com/questions/39830580/jest-test-fails-typeerror-window-matchmedia-is-not-a-function
*/
window.matchMedia =
  window.matchMedia ||
  function() {
    return {
      matches: false,
      addListener() {},
      removeListener() {},
    };
  };

test('has correct welcome text', () => {
  render(<ProgressBar currentStep={1} selectionMode='continuous' />);
  expect(screen.getByRole('heading')).toHaveTextContent('Welcome');
});

/*
    Enzyme has problems using Selectors, work around from:
    https://stackoverflow.com/questions/56145868/how-to-test-all-children-from-a-selector-except-the-first-child-in-jest
  */

/*
    const testElementClass = (elNum, className) => {
  const { container } = render(
    <ProgressBar currentStep={elNum} selectionMode='continuous' />
  );

  container.querySelectorAll('div.ant-steps-item').forEach((item, index) => {
    console.log('ITEM CLASSLIST', JSON.stringify(item.classList));
    if (index === elNum - 1) {
      // expect(item.hasClass(className)).toEqual(true);
      // expect(item.toHaveClass(className)).toEqual(true);
      // console.log('TRUE', JSON.stringify(item.classList));
      // console.log('TRUE CONTAINS', item.classList.contains(className));
      expect(item.classList.contains(className)).toBe(true);
    } else {
      // expect(item.hasClass(className)).toEqual(false);
      // expect(item.toHaveClass(className)).toEqual(true);
      // expect(item.classList.contains(className)).toBe(false);
    }
  });
};
*/

const testElementClass = (elNum, className) => {
  const { container } = render(
    <ProgressBar currentStep={elNum} selectionMode='continuous' />
  );

  for (let i = 0; i < 5; i++) {
    if (i === elNum) {
      expect(
        container
          .querySelector(`[data-testid='${i}']`)
          .classList.contains('ant-steps-item-active')
      ).toBe(true);
    } else {
      expect(
        container
          .querySelector(`[data-testid='${i}']`)
          .classList.contains('ant-steps-item-active')
      ).toBe(false);
    }
  }
  expect(
    container
      .querySelector("[data-testid='1']")
      .classList.contains('ant-steps-item-active')
  ).toBe(true);
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
/*
describe('Test that active step class renders with active class when current is between 0 and 3', () => {
  it(`should render step 1 with correct text and with active class when currentStep is 0`, () => {
    const { container } = render(
      <ProgressBar currentStep={0} selectionMode='continuous' />
    );
    expect(
      container
        .querySelector("[data-testid='1']")
        .classList.contains('ant-steps-item-active')
    ).toBe(true);
    expect(
      container
        .querySelector("[data-testid='2']")
        .classList.contains('ant-steps-item-active')
    ).toBe(false);
    expect(
      container
        .querySelector("[data-testid='3']")
        .classList.contains('ant-steps-item-active')
    ).toBe(false);
    expect(
      container
        .querySelector("[data-testid='4']")
        .classList.contains('ant-steps-item-active')
    ).toBe(false);
  });
  it(`should render step 2 with correct text and with active class when currentStep is 0`, () => {
    const { container } = render(
      <ProgressBar currentStep={1} selectionMode='continuous' />
    );
    expect(
      container
        .querySelector("[data-testid='1']")
        .classList.contains('ant-steps-item-active')
    ).toBe(false);
    expect(
      container
        .querySelector("[data-testid='2']")
        .classList.contains('ant-steps-item-active')
    ).toBe(true);
    expect(
      container
        .querySelector("[data-testid='3']")
        .classList.contains('ant-steps-item-active')
    ).toBe(false);
    expect(
      container
        .querySelector("[data-testid='4']")
        .classList.contains('ant-steps-item-active')
    ).toBe(false);
  });
});
*/
