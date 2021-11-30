import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';

import Discovery, { AccessLevel, AccessSortDirection } from './Discovery';
import { DiscoveryConfig } from './DiscoveryConfig';

import mockData from './__mocks__/mock_mds_studies.json';
import mockConfig from './__mocks__/mock_config.json';

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
      [AccessLevel.PENDING]: true,
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

const testStudies = mockData.map((study, i) => ({ ...study, __accessible: i % 2 ? AccessLevel.ACCESSIBLE : AccessLevel.NOT_AVAILABLE }));

const getDiscoveryComponent = (store, config: DiscoveryConfig, params = {}) => (
  <Provider store={store}>
    <StaticRouter location={{ pathname: '/discovery' }} context={{}}>
      <Discovery
        config={config}
        studies={testStudies}
        {...store.getState().discovery}
        params={params}
        onSearchChange={(searchTerm) => store.dispatch({ type: 'SEARCH_TERM_SET', searchTerm })}
        onTagsSelected={(selectedTags) => store.dispatch({ type: 'TAGS_SELECTED', selectedTags })}
        onAccessFilterSet={(accessFilters) => store.dispatch({ type: 'ACCESS_FILTER_SET', accessFilters })}
        onAccessSortDirectionSet={(accessSortDirection) => store.dispatch({ type: 'ACCESS_SORT_DIRECTION_SET', accessSortDirection })}
        onPaginationSet={(pagination) => store.dispatch({ type: 'PAGINATION_SET', pagination })}
        onResourcesSelected={(selectedResources) => store.dispatch({ type: 'RESOURCES_SELECTED', selectedResources })}
        onDiscoveryPageActive={() => store.dispatch({ type: 'ACTIVE_CHANGED', data: '/discovery' })}
        onRedirectForAction={(redirectState) => store.dispatch({ type: 'REDIRECTED_FOR_ACTION', redirectState })}
      />
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

describe('Configuration', () => {
  test('Page header is configurable', () => {
    const titleText = 'test title text';
    testConfig.features.pageTitle = { enabled: true, text: titleText };

    let wrapper = mount(getDiscoveryComponent(mockStore(initStoreData), testConfig));
    expect(wrapper.find('.discovery-page-title').text()).toBe(titleText);
    wrapper.unmount();

    testConfig.features.pageTitle = { enabled: false, text: titleText };
    wrapper = mount(getDiscoveryComponent(mockStore(initStoreData), testConfig));
    expect(wrapper.exists('.discovery-page-title')).toBe(false);
    wrapper.unmount();
  });

  test('Search bar can be enabled/disabled', () => {
    [true, false].forEach((enabled) => {
      testConfig.features.search.searchBar.enabled = enabled;
      const wrapper = mount(getDiscoveryComponent(mockStore(initStoreData), testConfig));
      expect(wrapper.exists('.discovery-search')).toBe(enabled);

      wrapper.unmount();
    });
  });

  test('Authorization checking can be enabled/disabled', () => {
    [true, false].forEach((enabled) => {
      testConfig.features.authorization.enabled = enabled;
      const wrapper = mount(getDiscoveryComponent(mockStore(initStoreData), testConfig));

      /* Disabling this check due to  https://ctds-planx.atlassian.net/browse/HP-393 */
      // accessible column in table should be present/hidden
      // expect(wrapper.exists('.discovery-table__access-icon')).toBe(enabled);

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
      const wrapper = mount(getDiscoveryComponent(mockStore(initStoreData), testConfig));
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
    const wrapper = mount(getDiscoveryComponent(mockStore(initStoreData), testConfig));
    wrapper.find('.discovery-table__row').at(modalDataIndex).simulate('click');
    const modal = wrapper.find('.discovery-modal').first();
    const modalData = testStudies[modalDataIndex];
    expect(modal.find('.discovery-modal__header-text').first().text()).toBe(modalData[headerField]);

    wrapper.unmount();
  });

  test('Modal fields show selected study\'s data with correct configuration', () => {
    const modalDataIndex = 2;
    const wrapper = mount(getDiscoveryComponent(mockStore(initStoreData), testConfig));
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
          expect(field.find('.discovery-modal__attribute-name').first().text()).toBe(`${fieldCfg.name}`);
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
          case 'link':
            expectedFieldData = (<a href={modalData[fieldCfg.field]}>{modalData[fieldCfg.field]}</a>);
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
    const store = mockStore(initStoreData);
    const wrapper = mount(
      getDiscoveryComponent(store, testConfig, { studyUID: permalinkStudyUID }),
    );

    testConfig.studyPageFields.header = { field: testConfig.minimalFieldMapping.uid };
    const modal = wrapper.find('.discovery-modal').first();

    // Check to see if the modal header shows the study's UID; other tests already test the fields.
    expect(modal.find('.discovery-modal__header-text').first().text()).toBe(permalinkStudyUID);

    wrapper.unmount();
  });
});

describe('Table', () => {
  test('Table filters records by tags', () => {
    testConfig.features.authorization.enabled = true;
    let store = mockStore(initStoreData);
    let wrapper = mount(getDiscoveryComponent(store, testConfig));

    // select the `COVID 19` tag
    const targetTagValue = 'COVID 19';
    const isTargetTag = (n) => n.hasClass('discovery-tag') && n.contains(targetTagValue);
    let tag = wrapper.findWhere(isTargetTag).first();
    tag.simulate('click');

    const selectedTags = { [targetTagValue]: true };
    const expectedTagSelectedAction = { type: 'TAGS_SELECTED', selectedTags };
    expect(store.getActions()).toContainEqual(expectedTagSelectedAction);
    wrapper.unmount();

    // select `COVID 19` tag on component with tag already selected
    store = mockStore({ ...initStoreData, discovery: { ...initStoreData.discovery, selectedTags } });
    wrapper = mount(getDiscoveryComponent(store, testConfig));

    // expect all rows in the table to have the 'COVID 19' tag
    const rows = wrapper.find('.discovery-table__row');
    expect(rows.everyWhere((r) => r.findWhere(isTargetTag).exists())).toBe(true);

    const isSelectedTag = (n) => n.hasClass('discovery-tag--selected');
    tag = wrapper.findWhere(isSelectedTag).first();
    expect(store.getActions()).toHaveLength(0);
    tag.simulate('click');

    const expectedTagClearedAction = { type: 'TAGS_SELECTED', selectedTags: { [targetTagValue]: undefined } };
    expect(store.getActions()).toContainEqual(expectedTagClearedAction);
    wrapper.unmount();
  });
});
