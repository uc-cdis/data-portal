import React from 'react';
import memoize from 'lodash/memoize';
import {
  Button, Checkbox, Collapse, Radio, RadioChangeEvent, Space,
} from 'antd';
import { UndoOutlined } from '@ant-design/icons';
import { DiscoveryConfig } from './DiscoveryConfig';
import { AccessLevel } from './Discovery';

interface Props {
  config: DiscoveryConfig;
  studies: {__accessible: AccessLevel, [any: string]: any}[]
  filterState: any;
  setFilterState: (any) => void;
  filterMultiSelectionLogic: string;
  setFilterMultiSelectionLogic: (any) => void;
}

const getFilterValuesByKey = memoize(
  (key: string, studies: any[] | null, config: DiscoveryConfig) => {
    if (!studies) {
      return [];
    }
    const filterValuesMap = {};
    studies.forEach((study) => {
      const filtersField = config.features.advSearchFilters?.field;
      if (!filtersField) {
        throw new Error('Misconfiguration error: missing required configuration property `discoveryConfig.features.advSearchFilters.field`');
      }
      if (!study[filtersField]) {
        // eslint-disable-next-line no-console
        console.warn(`Warning: expected to find property '${config.features.advSearchFilters?.field}' in study metadata for study ${study[config.minimalFieldMapping.uid]}, but could not find it! This study will not be filterable by the advanced search filters.`);
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
  <Space direction='vertical' style={{ width: 'inherit' }}>
    <div className='discovery-filters-control'>
      <Space>
        <Radio.Group
          defaultValue={props.filterMultiSelectionLogic}
          size='small'
          buttonStyle='solid'
          disabled={Object.keys(props.filterState).length === 0}
          onChange={({ target: { value } }: RadioChangeEvent) => {
            props.setFilterMultiSelectionLogic(value);
          }}
        >
          <Radio.Button value='AND'>AND</Radio.Button>
          <Radio.Button value='OR'>OR</Radio.Button>
        </Radio.Group>
        <Button
          type='default'
          size='small'
          className={'discovery-filters-control-button'}
          disabled={Object.keys(props.filterState).length === 0}
          onClick={() => { props.setFilterState({}); }}
          icon={<UndoOutlined />}
        >
          {'Reset Filters'}
        </Button>
      </Space>
    </div>
    <Collapse
      bordered={false}
      style={{ wordBreak: 'break-word' }}
      defaultActiveKey={props.config.features.advSearchFilters?.filters.map((f) => f.key)}
    >
      { props.config.features.advSearchFilters?.filters.map((filter) => {
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
                        if (Object.keys(newFilterState[key]).length === 0) {
                          delete newFilterState[key];
                        }
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
  </Space>
);

export default DiscoveryAdvancedSearchPanel;
