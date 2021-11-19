/* eslint-disable import/no-extraneous-dependencies */
import { library } from '@fortawesome/fontawesome-svg-core';
import { faAngleUp, faAngleDown } from '@fortawesome/free-solid-svg-icons';
import jestFetchMock from 'jest-fetch-mock'
import '@testing-library/jest-dom'

jestFetchMock.enableMocks()

library.add(faAngleUp, faAngleDown);

/* eslint-disable no-console */
// Tests will fail if there are any warning messages
console.warn = jest.fn((warn) => {
  throw new Error(warn);
});
