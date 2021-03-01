import React from 'react';
import { mount } from 'enzyme';

import Discovery, { AccessLevel } from './Discovery';
import { DiscoveryConfig } from './DiscoveryConfig';

import mockData from './__mocks__/mock_mds_studies.json';
import mockConfig from './__mocks__/mock_config.json';

const testStudies = mockData.map((study, i) => ({ ...study, __accessible: i % 2 === 0 }));

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
    const titleText = 'test title text';
    testConfig.features.pageTitle = { enabled: true, text: titleText };
    let wrapper = mount(<Discovery
      config={testConfig}
      studies={testStudies}
    />);
    expect(wrapper.find('.discovery-page-title').text()).toBe(titleText);
    wrapper.unmount();

    testConfig.features.pageTitle = { enabled: false, text: titleText };
    wrapper = mount(<Discovery
      config={testConfig}
      studies={testStudies}
    />);
    expect(wrapper.exists('.discovery-page-title')).toBe(false);
    wrapper.unmount();
  });

  test('Search bar can be enabled/disabled', () => {
    [true, false].forEach((enabled) => {
      testConfig.features.search.searchBar.enabled = enabled;
      const wrapper = mount(<Discovery
        config={testConfig}
        studies={testStudies}
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
        studies={testStudies}
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

describe('Modal', () => {
  test('Modal header field is enabled/disabled', () => {
    const modalDataIndex = 2;
    [true, false].forEach((enabled) => {
      testConfig.studyPageFields.header = enabled
        ? { field: testConfig.minimalFieldMapping.uid }
        : undefined;
      const wrapper = mount(<Discovery
        config={testConfig}
        studies={testStudies}
      />);
      wrapper.find('.discovery-table__row').at(modalDataIndex).simulate('click');
      const modal = wrapper.find('.discovery-modal').first();
      expect(modal.exists('.discovery-modal__header-text')).toBe(enabled);

      wrapper.unmount();
    });
  });

  test('Modal header field shows configured field', () => {
    const modalDataIndex = 2;
    const headerField = testConfig.minimalFieldMapping.uid;
    testConfig.studyPageFields.header = { field: headerField };
    const wrapper = mount(<Discovery
      config={testConfig}
      studies={testStudies}
    />);
    wrapper.find('.discovery-table__row').at(modalDataIndex).simulate('click');
    const modal = wrapper.find('.discovery-modal').first();
    const modalData = testStudies[modalDataIndex];
    expect(modal.find('.discovery-modal__header-text').first().text()).toBe(modalData[headerField]);

    wrapper.unmount();
  });

  test('Modal fields show selected study\'s data with correct configuration', () => {
    const modalDataIndex = 2;
    const wrapper = mount(<Discovery
      config={testConfig}
      studies={testStudies}
    />);
    wrapper.find('.discovery-table__row').at(modalDataIndex).simulate('click');
    const modal = wrapper.find('.discovery-modal').first();
    const modalData = testStudies[modalDataIndex];

    testConfig.studyPageFields.fieldsToShow.forEach((fieldGroupCfg, i) => {
      const group = modal.find('.discovery-modal__attribute-group').at(i);
      if (fieldGroupCfg.includeName) {
        expect(group.find('.discovery-modal__attribute-group-name').first().text()).toBe(fieldGroupCfg.groupName);
      }

      let fieldIdx = 0;
      fieldGroupCfg.fields.forEach((fieldCfg) => {
        const fieldIsHidden = !modalData[fieldCfg.field] && !fieldCfg.includeIfNotAvailable;
        if (fieldIsHidden) {
          // Field is hidden if it's missing data and configured to hide missing data
          // In that case because this field isn't displayed, skip over this field and
          // don't increment fieldIdx.
          return;
        }

        const field = group.find('.discovery-modal__attribute').at(fieldIdx);

        // expect field to show correct field name, if configured to show a field name.
        if (fieldCfg.includeName !== false) {
          expect(field.find('.discovery-modal__attribute-name').first().text()).toBe(`${fieldCfg.name}:`);
        } else {
          expect(field.exists('.discovery-modal__attribute-name')).toBe(false);
        }

        // expect field to display default value if field is missing data
        if (!modalData[fieldCfg.field]) {
          if (fieldCfg.includeIfNotAvailable) {
            expect(field.find('.discovery-modal__attribute-value').first().text()).toBe(fieldCfg.valueIfNotAvailable);
          }
        } else {
          // expect field to display the correct data, formatted according to content_type.
          let expectedFieldData;
          switch (fieldCfg.contentType) {
          case 'string':
            expectedFieldData = modalData[fieldCfg.field];
            break;
          case 'paragraphs':
            expectedFieldData = modalData[fieldCfg.field].replace(/\n/g, '');
            break;
          case 'number':
            expectedFieldData = modalData[fieldCfg.field].toLocaleString();
            break;
          default:
            throw new Error(`Unrecognized content_type ${fieldCfg.contentType}.`);
          }

          expect(field.find('.discovery-modal__attribute-value').first().text()).toBe(expectedFieldData);
        }
        fieldIdx += 1;
      });
    });

    wrapper.unmount();
  });

  test('Discovery page opens modal with correct data on permalink', () => {
    const permalinkStudyIndex = 5;
    const permalinkStudyData = testStudies[permalinkStudyIndex];
    const permalinkStudyUID = permalinkStudyData[testConfig.minimalFieldMapping.uid];
    const wrapper = mount(<Discovery
      config={testConfig}
      studies={testStudies}
      params={{ studyUID: permalinkStudyUID }}
    />);

    testConfig.studyPageFields.header = { field: testConfig.minimalFieldMapping.uid };
    const modal = wrapper.find('.discovery-modal').first();

    // Check to see if the modal header shows the study's UID; other tests already test the fields.
    expect(modal.find('.discovery-modal__header-text').first().text()).toBe(permalinkStudyUID);

    wrapper.unmount();
  });
});


describe('Table', () => {
  test('Table filters records by access level', () => {
    testConfig.features.authorization.enabled = true;
    const wrapper = mount(<Discovery
      config={testConfig}
      studies={testStudies}
    />);

    const accessSelector = wrapper.find('.discovery-access-selector').first();
    accessSelector.invoke('onChange')({ target: { value: AccessLevel.ACCESSIBLE } });
    let rows = wrapper.find('.discovery-table__row');
    // all rows should have an unlock icon (accessible)
    expect(rows.everyWhere(r => r.exists('[aria-label="unlock"]'))).toBe(true);

    accessSelector.invoke('onChange')({ target: { value: AccessLevel.UNACCESSIBLE } });
    rows = wrapper.find('.discovery-table__row');
    // all rows should have an lock icon (unaccessible)
    expect(rows.everyWhere(r => r.exists('[aria-label="lock"]'))).toBe(true);

    accessSelector.invoke('onChange')({ target: { value: AccessLevel.BOTH } });
    rows = wrapper.find('.discovery-table__row');
    // all rows should have either a lock or an unlock icon
    expect(rows.everyWhere(r => r.exists('[aria-label="unlock"]') || r.exists('[aria-label="lock"]'))).toBe(true);

    wrapper.unmount();
  });

  test('Table filters records by tags', () => {
    testConfig.features.authorization.enabled = true;
    const wrapper = mount(<Discovery
      config={testConfig}
      studies={testStudies}
    />);

    // select the `COVID 19` tag
    const targetTagValue = 'COVID 19';
    const isTargetTag = n => n.hasClass('discovery-tag') && n.contains(targetTagValue);
    const tag = wrapper.findWhere(isTargetTag).first();
    tag.simulate('click');
    // expect all rows in the table to have the 'COVID 19' tag
    let rows = wrapper.find('.discovery-table__row');
    expect(rows.everyWhere(r => r.findWhere(isTargetTag).exists())).toBe(true);

    // unselect the `COVID 19` tag
    tag.simulate('click');
    rows = wrapper.find('.discovery-table__row');
    // expect that not all rows have the 'COVID 19' tag
    expect(rows.everyWhere(r => r.findWhere(isTargetTag).exists())).toBe(false);

    wrapper.unmount();
  });
});
