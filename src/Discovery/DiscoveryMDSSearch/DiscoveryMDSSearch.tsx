import React, { useState } from 'react';
import { Input, Radio, Checkbox } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import './DiscoveryMDSSearch.css';

interface SearchableAndSelectableTextFields {
  [key: string]: string; // Each key is a string and its value is also a string
}
interface DiscoveryMDSSearchProps {
  searchableAndSelectableTextFields: SearchableAndSelectableTextFields | undefined;
  searchTerm: string;
  handleSearchChange: Function;
  inputSubtitle: string | undefined;
}

const DiscoveryMDSSearch: React.FC<DiscoveryMDSSearchProps> = (props) => {
  const [radioValue, setRadioValue] = useState('fullTextSearch');
  const [checkedValues, setCheckedValues] = useState(new Set());
  const onRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRadioValue(e.target.value);
    if (e.target.value === 'fullTextSearch') {
      setCheckedValues(new Set());
    }
  };
  const onCheckboxChange = (currentCheckedValue: string) => {
    const newItems = new Set(checkedValues);
    if (checkedValues.has(currentCheckedValue)) {
      newItems.delete(currentCheckedValue);
    } else {
      newItems.add(currentCheckedValue);
    }
    setCheckedValues(newItems);
  };

  return (
    <React.Fragment>
      <Input
        className='discovery-search'
        prefix={<SearchOutlined />}
        placeholder='Search studies by keyword...'
        value={props.searchTerm}
        onChange={props.handleSearchChange}
        size='large'
        allowClear
      />
      <div className='discovery-input-subtitle'>{props.inputSubtitle}</div>
      {props.searchableAndSelectableTextFields
      && (
        <React.Fragment>
          <div className='discovery-search-radio-container'>
            <Radio.Group onChange={onRadioChange} value={radioValue}>
              <Radio value='fullTextSearch' className='discovery-search-radio-left'>
            Full Text Search
              </Radio>
              <Radio
                value='restrictSearch'
                className='discovery-search-radio-right'
              >
            Restrict Search to Selected Fields
              </Radio>
            </Radio.Group>
          </div>
          <div className='discovery-search-checkbox-container'>
            {Object.entries(props.searchableAndSelectableTextFields).map(
              ([key, value]) => (
                <React.Fragment key={key}>
                  <Checkbox
                    className='discovery-search-checkbox-item'
                    disabled={radioValue === 'fullTextSearch'}
                    checked={checkedValues.has(value)}
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

export default DiscoveryMDSSearch;
