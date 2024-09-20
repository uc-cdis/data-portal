import React from 'react';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import mockData from './__mocks__/mock_mds_studies.json';
import mockConfig from './__mocks__/mock_config.json';
import DiscoveryWithMDSBackend from './index.tsx';
import { DiscoveryConfig } from './DiscoveryConfig';
import { AccessLevel, AccessSortDirection } from './Discovery';
import * as MDSUtils from './MDSUtils';
import * as aggMDSUtils from './aggMDSUtils';

const mockStore = configureMockStore();
const initStoreData = {
  user: {
    username: 'mock_user',
  },
  discovery: {
    selectedResources: [],
    actionToResume: null,
    accessFilters: {
      [AccessLevel.ACCESSIBLE]: true,
      [AccessLevel.UNACCESSIBLE]: true,
      [AccessLevel.WAITING]: true,
      [AccessLevel.NOT_AVAILABLE]: true,
    },
    selectedTags: {},
    pagination: {
      resultsPerPage: 10,
      currentPage: 1,
    },
    accessSortDirection: AccessSortDirection.DESCENDING,
  },
};

const defaultProps = {
  selectedResources: [1, 2, 3],
  userAggregateAuthMappings: {},
  config: {
    features: { authorization: { enabled: false } },
    minimalFieldMapping: {},
  },
  awaitingDownload: false,
  pagination: { currentPage: 1, resultsPerPage: 10 },
  selectedTags: [],
  searchTerm: '',
  accessSortDirection: 'asc',
  accessFilters: {},
  onAdvancedSearch: jest.fn(),
  onSearchChange: jest.fn(),
  onTagsSelected: jest.fn(),
  onAccessFilterSet: jest.fn(),
  onAccessSortDirectionSet: jest.fn(),
  onPaginationSet: jest.fn(),
  onResourcesSelected: jest.fn(),
  onDiscoveryPageActive: jest.fn(),
  onRedirectForAction: jest.fn(),
};

const getIndexComponent = (store, config: DiscoveryConfig, params = {}) => (
  <Provider store={store}>
    <StaticRouter location={{ pathname: '/index' }} context={{}}>
      <DiscoveryWithMDSBackend {...defaultProps} />
    </StaticRouter>
  </Provider>
);

// This mock is required to avoid errors when rendering the Discovery page
// with enzyme's `mount` method (which uses jsdom). (antd components use window.matchMedia)
// See https://jestjs.io/docs/en/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
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

let testConfig: DiscoveryConfig;
beforeEach(() => {
  testConfig = mockConfig as DiscoveryConfig;
});


// Mock the loadStudiesFromAggMDS and getSomeStudiesFromMDS functions
jest.mock('./MDSUtils', () => ({
  loadStudiesFromMDS: jest.fn(),
  getSomeStudiesFromMDS: jest.fn(),
}));

jest.mock('./aggMDSUtils', () => ({
  loadStudiesFromAggMDS: jest.fn(),
}));

describe('Configuration', () => {
  beforeAll(() => {
    // Mock console.error
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  test('prints to screen', async () => {
    MDSUtils.getSomeStudiesFromMDS.mockResolvedValueOnce(mockData);
    aggMDSUtils.loadStudiesFromAggMDS.mockResolvedValueOnce(mockData);

    const wrapper = mount(getIndexComponent(mockStore(initStoreData), testConfig));
    console.log('FIRST LOAD');
    console.log(wrapper.debug());
    expect(wrapper.find('.discovery-header__stat-number').text()).toBe('0');
    expect(wrapper.find('.discovery-header__stat-label').at(1).text()).toBe('Loading studies...');

    await new Promise(setImmediate); // Wait for promises to resolve
    wrapper.update(); // Update the wrapper to reflect the changes
    console.log('****************************************');
    console.log('SECOND LOAD');
    console.log(wrapper.debug());

    // expect(wrapper.find('.discovery-header__stat-number').text()).toBe('10');
    // Wait for the studies to be fetched
    // await new Promise(setImmediate);
    // wrapper.update();

    // Assertions: Check if the studies were populated correctly
    // expect(wrapper.find('.discovery-header__stat-number').text()).toBe('10');
  });
});
