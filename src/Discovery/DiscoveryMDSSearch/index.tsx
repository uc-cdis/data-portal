import React, { ChangeEventHandler, useState, useEffect } from 'react';
import {
  Input, Radio, Checkbox, RadioChangeEvent,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import './DiscoveryMDSSearch.css';

interface SearchableAndSelectableTextFields {
  [key: string]: string;
}

interface DiscoveryMDSSearchProps {
  searchableTextFields?: string[];
  searchableAndSelectableTextFields?: SearchableAndSelectableTextFields;
  setSelectedSearchableTextFields?: Function;
  searchTerm: string;
  handleSearchChange: ChangeEventHandler<HTMLInputElement>;
  inputSubtitle: string | undefined;
}

const DiscoveryMDSSearch: React.FC<DiscoveryMDSSearchProps> = ({
  searchableTextFields = [],
  searchableAndSelectableTextFields = {},
  setSelectedSearchableTextFields = () => null,
  searchTerm,
  handleSearchChange,
  inputSubtitle,
}) => {
  const [radioValue, setRadioValue] = useState('fullTextSearch');
  const [checkboxGroupValues, setCheckboxGroupValues] = useState(Object.values(searchableAndSelectableTextFields));

  const onRadioChange = (e: RadioChangeEvent) => {
    setRadioValue(e.target.value);
    if (e.target.value === 'fullTextSearch') {
      setSelectedSearchableTextFields([...searchableTextFields, ...Object.values(searchableAndSelectableTextFields)]);
    } else {
      setCheckboxGroupValues(checkboxGroupValues);
      setSelectedSearchableTextFields(checkboxGroupValues);
    }
  };

  const onCheckboxGroupChange = (currentCheckedValues) => {
    setCheckboxGroupValues(currentCheckedValues);
    setSelectedSearchableTextFields(currentCheckedValues);
  };

  const checkboxGroupOptions = Object.entries(searchableAndSelectableTextFields).map(([key, value]) => ({ label: key, value }));

  return (
    <React.Fragment>
      <Input
        className='discovery-search'
        prefix={<SearchOutlined />}
        placeholder='Search studies by keyword...'
        value={searchTerm}
        onChange={handleSearchChange}
        size='large'
        allowClear
      />
      <div className='discovery-input-subtitle'>{inputSubtitle}</div>
      {searchableAndSelectableTextFields && (
        <React.Fragment>
          <div className='discovery-search-radio-container'>
            <Radio.Group onChange={onRadioChange} value={radioValue}>
              <Radio value='fullTextSearch' className='discovery-search-radio-left'>
                Full Text Search
              </Radio>
              <Radio value='restrictSearch' className='discovery-search-radio-right'>
                Restrict Search to Selected Fields
              </Radio>
            </Radio.Group>
          </div>
          <div className='discovery-search-checkbox-container'>
            <Checkbox.Group
              options={checkboxGroupOptions}
              disabled={radioValue === 'fullTextSearch'}
              defaultValue={checkboxGroupValues}
              onChange={onCheckboxGroupChange}
            />
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

DiscoveryMDSSearch.defaultProps = {
  searchableTextFields: [],
  searchableAndSelectableTextFields: undefined,
  setSelectedSearchableTextFields: () => null,
};

export default DiscoveryMDSSearch;
