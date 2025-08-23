import React, { ChangeEventHandler, useState } from 'react';
import {
  Input, Radio, Checkbox, RadioChangeEvent,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import './DiscoveryMDSSearch.css';
import { SearchMode } from '../Discovery';

interface SearchableAndSelectableTextFields {
  [key: string]: string;
}

interface DiscoveryMDSSearchProps {
  searchableTextFields?: string[];
  searchableAndSelectableTextFields?: SearchableAndSelectableTextFields;
  setSelectedSearchableTextFields?: Function;
  searchMode: string;
  setSearchMode: Function;
  searchTerm: string;
  handleSearchChange: ChangeEventHandler<HTMLInputElement>;
  inputSubtitle: string | undefined;
}

const DiscoveryMDSSearch: React.FC<DiscoveryMDSSearchProps> = ({
  searchableTextFields = [],
  searchableAndSelectableTextFields = {},
  setSelectedSearchableTextFields = () => null,
  searchMode,
  setSearchMode,
  searchTerm,
  handleSearchChange,
  inputSubtitle,
}) => {
  const [checkboxGroupValues, setCheckboxGroupValues] = useState([]);

  const onRadioChange = (e: RadioChangeEvent) => {
    setSearchMode(e.target.value);
    if (e.target.value === SearchMode.FULL_TEXT) {
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
            <Radio.Group onChange={onRadioChange} value={searchMode}>
              <Radio value={SearchMode.FULL_TEXT} className='discovery-search-radio-left'>
                Full Text Search
              </Radio>
              <Radio value={SearchMode.RESTRICTED} className='discovery-search-radio-right'>
                Restrict Search to Selected Fields
              </Radio>
            </Radio.Group>
          </div>
          <div className='discovery-search-checkbox-container'>
            <Checkbox.Group
              options={checkboxGroupOptions}
              disabled={searchMode === SearchMode.FULL_TEXT}
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
