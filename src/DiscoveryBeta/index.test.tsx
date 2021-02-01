import React from 'react';
import { shallow } from 'enzyme';
import { DiscoveryConfig } from './DiscoveryConfig';
import { DiscoveryContainer } from './index';

import mockData from './__mocks__/mock_mds_studies.json';
import mockConfig from './__mocks__/mock_config.json';
import Discovery from './DiscoveryBeta';

const loadTestResources = async (): Promise<any> => {
  // DEV ONLY
  const jsonResponse = mockData;
  const resources = Object.values(jsonResponse).map((entry: any) => entry.gen3_discovery);
  return Promise.resolve(resources);
  // END DEV ONLY
};

describe('Modal', () => {
  test('shows data from selected study', async () => {
    const container = shallow(<DiscoveryContainer
      config={mockConfig as DiscoveryConfig}
      loadResources={loadTestResources}
      userAuthMapping={{}}
    />);
    await setTimeout(() => container.update(), 1000);
    console.log(container.html());
    // const discovery = container.find(Discovery);
    // modal is not open on first page render
    expect(discovery.props().modalVisible).toBe(false);
    // user selects a study
    // expect modal to open to that study
    // console.log(discovery.children());
  });
});
