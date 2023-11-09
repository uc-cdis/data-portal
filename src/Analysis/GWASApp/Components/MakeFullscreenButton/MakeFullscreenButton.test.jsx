import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MakeFullscreenButton from './MakeFullscreenButton';
import FullScreenClassNames from './FullscreenClassNames';

describe('MakeFullscreenButton', () => {
  beforeEach(() => {
    // Manually add elements with classNames to be hidden / shown to the DOM
    FullScreenClassNames.forEach((className) => {
      const element = document.createElement('div');
      element.className = className.replace('.', '');
      document.body.appendChild(element);
    });
  });

  afterEach(() => {
    // Clean up: remove added elements from the DOM
    FullScreenClassNames.forEach((className) => {
      document.querySelectorAll(className)
        .forEach((element) => element.remove());
    });
  });

  it('should toggle fullscreen mode and show/hide elements accordingly', () => {
    const { getByText } = render(<MakeFullscreenButton />);
    FullScreenClassNames.forEach((className) => {
      const element = document.querySelector(className);
      expect(element).toHaveStyle('display: block');
    });

    // Click the button to enter fullscreen mode
    fireEvent.click(getByText('Make Fullscreen'));

    // Elements with selectors should be hidden in fullscreen mode
    FullScreenClassNames.forEach((className) => {
      const element = document.querySelector(className);
      expect(element).toHaveStyle('display: none');
    });

    // Click the button to exit fullscreen mode
    fireEvent.click(getByText('Exit Fullscreen'));

    // Elements with selectors should be visible again
    FullScreenClassNames.forEach((className) => {
      const element = document.querySelector(className);
      expect(element).toHaveStyle('display: block');
    });
  });
});
