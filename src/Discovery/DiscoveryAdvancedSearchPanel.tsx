import React from 'react';
import memoize from 'lodash/memoize';
import { Checkbox, Collapse, Space } from 'antd';
import { DiscoveryConfig } from './DiscoveryConfig';
import { AccessLevel } from './Discovery';

interface Props {
  config: DiscoveryConfig;
  studies: {__accessible: AccessLevel, [any: string]: any}[]
  filterState: any;
  setFilterState: (boolean) => void;
}

const getFilterValuesByKey = memoize(
  (key: string, studies: any[] | null, config: DiscoveryConfig) => {
    if (!studies) {
      return [];
    }
    const filterValuesMap = {};
    studies.forEach((study) => {
      const filtersField = config.features.advSearchFilters.field;
      if (!filtersField) {
        throw new Error('Misconfiguration error: missing required configuration property `discoveryConfig.features.advSearchFilters.field`');
      }
      if (!study[filtersField]) {
        // eslint-disable-next-line no-console
        console.warn(`Warning: expected to find property '${config.features.advSearchFilters.field}' in study metadata for study ${study[config.minimalFieldMapping.uid]}, but could not find it! This study will not be filterable by the advanced search filters.`);
        return;
      }
      try {
        study[filtersField].forEach((filterValue) => {
          if (filterValue.key === key) {
            filterValuesMap[filterValue.value] = true;
          }
        });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        // eslint-disable-next-line no-console
        console.error(`The above error appeared in study ${study[config.minimalFieldMapping.uid]}`);
      }
    });
    return Object.keys(filterValuesMap);
  },
);

const DiscoveryAdvancedSearchPanel = (props: Props) => (
  <Collapse
    bordered={false}
    defaultActiveKey={props.config.features.advSearchFilters.filters.map((f) => f.key)}
  >
    { props.config.features.advSearchFilters.filters.map((filter) => {
      const { key, keyDisplayName } = filter;
      const values = getFilterValuesByKey(key, props.studies, props.config);
      return (
        <Collapse.Panel header={keyDisplayName || key} key={key}>
          <Space direction='vertical'>
            { values.map((value) => {
              const valueDisplayName = (filter.valueDisplayNames && filter.valueDisplayNames[value])
                ? filter.valueDisplayNames[value]
                : value;
              return (
                <Checkbox
                  key={`${key}-${value}`}
                  checked={props.filterState[key] && props.filterState[key][value]}
                  onChange={(ev) => {
                    const newFilterState = { ...props.filterState };
                    if (!newFilterState[key]) {
                      newFilterState[key] = {};
                    }
                    if (ev.target.checked) {
                      newFilterState[key][value] = true;
                    } else {
                      delete newFilterState[key][value];
                    }
                    props.setFilterState(newFilterState);
                  }}
                >
                  {valueDisplayName}
                </Checkbox>
              );
            })}
          </Space>
        </Collapse.Panel>
      );
    })}
  </Collapse>
);

export default DiscoveryAdvancedSearchPanel;
