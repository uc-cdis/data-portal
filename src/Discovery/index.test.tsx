// DiscoveryWithMDSBackend.test.js

import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import DiscoveryWithMDSBackend from './DiscoveryWithMDSBackend';
import rootReducer from '../reducers'; // Adjust the import to match your root reducer

// Mock the dependencies
jest.mock('../helpers/featureFlags', () => ({
  __esModule: true,
  default: jest.fn(() => true),
}));

jest.mock('./aggMDSUtils', () => ({
  loadStudiesFromAggMDS: jest.fn(),
}));

jest.mock('./MDSUtils', () => ({
  getSomeStudiesFromMDS: jest.fn(),
  loadStudiesFromMDS: jest.fn(),
}));

jest.mock('../authMappingUtils', () => ({
  userHasMethodForServiceOnResource: jest.fn(() => true),
}));

// Create a mock store
const mockStore = createStore(rootReducer, {
  userAuthMapping: {},
  userAggregateAuthMappings: {},
  discovery: {},
});

const setup = (props) => {
  return render(
    <Provider store={mockStore}>
      <DiscoveryWithMDSBackend {...props} />
    </Provider>
  );
};

describe('DiscoveryWithMDSBackend', () => {
  const defaultProps = {
    userAggregateAuthMappings: {},
    config: {
      features: { authorization: { enabled: false } },
      minimalFieldMapping: {},
    },
    awaitingDownload: false,
    selectedResources: [],
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

  test('changes number of batches based on props', async () => {
    // Define different sets of props to test different conditions
    const propsWithStudyRegistration = {
      ...defaultProps,
      config: {
        ...defaultProps.config,
        features: { ...defaultProps.config.features, studyRegistration: true },
      },
    };

    const propsWithoutStudyRegistration = {
      ...defaultProps,
      config: {
        ...defaultProps.config,
        features: { ...defaultProps.config.features, studyRegistration: false },
      },
    };

    const mockStudies = Array.from({ length: 12 }, (_, i) => ({
      id: `${i}`,
      name: `Study ${i + 1}`,
    }));
    require('./aggMDSUtils').loadStudiesFromAggMDS.mockResolvedValue(
      mockStudies
    );
    require('./MDSUtils').getSomeStudiesFromMDS.mockResolvedValue(mockStudies);

    // First, test with study registration enabled
    setup(propsWithStudyRegistration);

    await act(async () => {
      await waitFor(() => {
        expect(screen.getByText('Study 12')).toBeInTheDocument();
      });
    });

    // Verify that the number of batches loaded is as expected when study registration is enabled
    expect(require('./aggMDSUtils').loadStudiesFromAggMDS).toHaveBeenCalledWith(
      5
    ); // smaller batch
    expect(require('./MDSUtils').getSomeStudiesFromMDS).toHaveBeenCalledWith(
      'unregistered_discovery_metadata',
      5
    ); // unregistered studies batch

    // Next, test with study registration disabled
    setup(propsWithoutStudyRegistration);

    await act(async () => {
      await waitFor(() => {
        expect(screen.getByText('Study 12')).toBeInTheDocument();
      });
    });

    // Verify that the number of batches loaded is as expected when study registration is disabled
    expect(require('./aggMDSUtils').loadStudiesFromAggMDS).toHaveBeenCalledWith(
      10
    ); // smaller batch
    expect(require('./MDSUtils').getSomeStudiesFromMDS).not.toHaveBeenCalled(); // no unregistered studies batch
  });
});
