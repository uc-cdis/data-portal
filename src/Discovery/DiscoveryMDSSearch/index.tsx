import React, { ChangeEventHandler, useState } from 'react';
import {
  Input, Radio, Checkbox, RadioChangeEvent,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import './DiscoveryMDSSearch.css';

interface SearchableAndSelectableTextFields {
  [key: string]: string;
}

interface DiscoveryMDSSearchProps {
  searchableAndSelectableTextFields?: SearchableAndSelectableTextFields;
  selectedSearchableTextFields?: string[];
  setSelectedSearchableTextFields?: Function;
  searchTerm: string;
  handleSearchChange: ChangeEventHandler<HTMLInputElement>;
  inputSubtitle: string | undefined;
}

const DiscoveryMDSSearch: React.FC<DiscoveryMDSSearchProps> = ({
  searchableAndSelectableTextFields = false as unknown as SearchableAndSelectableTextFields,
  selectedSearchableTextFields = [],
  setSelectedSearchableTextFields = () => null,
  searchTerm,
  handleSearchChange,
  inputSubtitle,
}) => {
  const [radioValue, setRadioValue] = useState('fullTextSearch');

  const onRadioChange = (e: RadioChangeEvent) => {
    setRadioValue(e.target.value);
    if (e.target.value === 'fullTextSearch') {
      setSelectedSearchableTextFields([]);
    }
  };

  const onCheckboxChange = (currentCheckedValue: string) => {
    if (selectedSearchableTextFields.includes(currentCheckedValue)) {
      const selectionsWithCurrentCheckedValueRemoved = selectedSearchableTextFields.filter(
        (value) => value !== currentCheckedValue,
      );
      setSelectedSearchableTextFields(selectionsWithCurrentCheckedValueRemoved);
    } else {
      setSelectedSearchableTextFields([...selectedSearchableTextFields, currentCheckedValue]);
    }
  };

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
            {Object.entries(searchableAndSelectableTextFields).map(
              ([key, value]) => (
                <React.Fragment key={key}>
                  <Checkbox
                    className='discovery-search-checkbox-item'
                    disabled={radioValue === 'fullTextSearch'}
                    checked={selectedSearchableTextFields.includes(value)}
                    onChange={() => onCheckboxChange(value)}
                  >
                    {key}
                  </Checkbox>
                </React.Fragment>
              ),
            )}
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

DiscoveryMDSSearch.defaultProps = {
  searchableAndSelectableTextFields: false as unknown as SearchableAndSelectableTextFields,
  selectedSearchableTextFields: [],
  setSelectedSearchableTextFields: () => null,
};

export default DiscoveryMDSSearch;
