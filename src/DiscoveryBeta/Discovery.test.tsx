import React from 'react';
import { mount } from 'enzyme';

import Discovery from './Discovery';
import { DiscoveryConfig } from './DiscoveryConfig';

import mockData from './__mocks__/mock_mds_studies.json';
import mockConfig from './__mocks__/mock_config.json';

// const testConfig = mockConfig as DiscoveryConfig;
const testStudiesAccessible = mockData.map(study => ({ ...study, __accessible: true }));
const testStudiesUnaccessible = mockData.map(study => ({ ...study, __accessible: false }));
const testStudiesMixedAccessibility = mockData.map(
  (study, i) => ({ ...study, __accessible: i % 2 === 0 }));

// This mock is required to avoid errors when rendering the Discovery page
// with enzyme's `mount` method (which uses jsdom). (antd components use window.matchMedia)
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

let testConfig: DiscoveryConfig;
beforeEach(() => {
  testConfig = mockConfig as DiscoveryConfig;
});

describe('Configuration', () => {
  test('Page header is configurable', () => {
    const wrapper = mount(<Discovery
      config={testConfig}
      studies={testStudiesAccessible}
    />);
    expect(wrapper.find('.discovery-page-title').text()).toBe(testConfig.pageTitle);

    wrapper.unmount();
  });

  test('Search bar can be enabled/disabled', () => {
    [true, false].forEach((enabled) => {
      testConfig.features.search.search_bar.enabled = enabled;
      const wrapper = mount(<Discovery
        config={testConfig}
        studies={testStudiesAccessible}
      />);
      expect(wrapper.exists('.discovery-search')).toBe(enabled);

      wrapper.unmount();
    });
  });

  test('Authorization checking can be enabled/disabled', () => {
    [true, false].forEach((enabled) => {
      testConfig.features.authorization.enabled = enabled;
      const wrapper = mount(<Discovery
        config={testConfig}
        studies={testStudiesAccessible}
      />);
      // access filter should be present/hidden
      expect(wrapper.exists('.discovery-access-selector')).toBe(enabled);
      // accessible column in table should be present/hidden
      expect(wrapper.exists('.discovery-table__access-icon')).toBe(enabled);
      // access info in modal should be present/hidden
      // Open modal to a study by clicking on the first row
      wrapper.find('.discovery-table__row').first().simulate('click');
      expect(wrapper.exists('.discovery-modal__access-alert')).toBe(enabled);

      wrapper.unmount();
    });
  });
});
