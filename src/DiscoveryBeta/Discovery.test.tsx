import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';

import Discovery from './Discovery';
import { DiscoveryConfig } from './DiscoveryConfig';

import mockData from './__mocks__/mock_mds_studies.json';
import mockConfig from './__mocks__/mock_config.json';

const testConfig = mockConfig as DiscoveryConfig;
const testStudies = mockData.map(study => ({ ...study, __accessible: true }));

// Mocks window.matchMedia which is used by antd components.
// This is required to avoid errors when jsdom rendering the Discovery page,
// which uses antd components.
// See https://jestjs.io/docs/en/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
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

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

test('Page header is configurable', () => {
  act(() => {
    render(<Discovery
      config={testConfig}
      studies={testStudies}
    />, container);
  });
  expect(container.querySelector('.discovery-page-title').textContent).toBe(testConfig.pageTitle);
});
