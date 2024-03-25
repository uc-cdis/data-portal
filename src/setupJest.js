import 'core-js/stable';
import 'regenerator-runtime/runtime';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faAngleUp, faAngleDown } from '@fortawesome/free-solid-svg-icons';

global.fetch = require('jest-fetch-mock');

library.add(faAngleUp, faAngleDown);
Enzyme.configure({ adapter: new Adapter() });

/* eslint-disable no-console */
// Tests will fail if there are any warning messages
console.warn = jest.fn((warn) => {
  throw new Error(warn);
});

console.log(`Warning: MatchMedia override per JEST DOCS is added in setupJest.js:
    https://jestjs.io/docs/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom`);
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

global.userAgent = jest.spyOn(navigator, 'userAgent', 'get');
