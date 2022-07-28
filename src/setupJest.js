/* eslint-disable import/no-extraneous-dependencies */
import { library } from '@fortawesome/fontawesome-svg-core';
import { faAngleUp, faAngleDown, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import jestFetchMock from 'jest-fetch-mock'
import '@testing-library/jest-dom'
import crypto from 'crypto'

jestFetchMock.enableMocks()

library.add(faAngleUp, faAngleDown, faTriangleExclamation);

/* eslint-disable no-console */
// Tests will fail if there are any warning messages
console.warn = jest.fn((warn) => {
  throw new Error(warn);
});

// Tests for explorer requires crypto.randomUUID() web API
Object.defineProperty(global, 'crypto', {
  value: { randomUUID: crypto.randomUUID }
})