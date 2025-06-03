import React, { useState } from 'react';
import { Input, Radio, Checkbox } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import './DiscoveryMDSSearch.css';

const DiscoveryMDSSearch = (props: {
  searchTerm;
  handleSearchChange;
  inputSubtitle;
}) => {
  const [radioValue, setRadioValue] = useState('fullTextSearch');
  const [checkedValues, setCheckedValues] = useState([] as string[]);
  const onRadioChange = (e) => {
    setRadioValue(e.target.value);
    if (e.target.value === 'fullTextSearch') {
      setCheckedValues([]);
    }
  };
  const onCheckboxChange = (checkedValues) => {
    setCheckedValues(checkedValues);
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
        <Checkbox
          className='discovery-search-checkbox-item'
          disabled={radioValue === 'fullTextSearch'}
          checked={checkedValues.includes('studyName')}
          onChange={() => onCheckboxChange([...checkedValues, 'studyName'])}
        >
          Study Name
        </Checkbox>
        <Checkbox
          className='discovery-search-checkbox-item'
          disabled={radioValue === 'fullTextSearch'}
          checked={checkedValues.includes('Project Number')}
          onChange={() =>
            onCheckboxChange([...checkedValues, 'Project Number'])
          }
        >
          Project Number
        </Checkbox>
        <Checkbox
          className='discovery-search-checkbox-item'
          disabled={radioValue === 'fullTextSearch'}
          checked={checkedValues.includes('DOI')}
          onChange={() => onCheckboxChange([...checkedValues, 'DOI'])}
        >
          DOI
        </Checkbox>
        <Checkbox
          className='discovery-search-checkbox-item'
          disabled={radioValue === 'fullTextSearch'}
          checked={checkedValues.includes('Research Program')}
          onChange={() =>
            onCheckboxChange([...checkedValues, 'Research Program'])
          }
        >
          Research Program
        </Checkbox>
        <Checkbox
          className='discovery-search-checkbox-item'
          disabled={radioValue === 'fullTextSearch'}
          checked={checkedValues.includes('CDE Drupal ID')}
          onChange={() => onCheckboxChange([...checkedValues, 'CDE Drupal ID'])}
        >
          CDE Drupal ID
        </Checkbox>
        <Checkbox
          className='discovery-search-checkbox-item'
          disabled={radioValue === 'fullTextSearch'}
          checked={checkedValues.includes('CDE Field Name')}
          onChange={() =>
            onCheckboxChange([...checkedValues, 'CDE Field Name'])
          }
        >
          CDE Field Name
        </Checkbox>
      </div>
    </React.Fragment>
  );
};

export default DiscoveryMDSSearch;
