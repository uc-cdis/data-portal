import React, { ChangeEventHandler, useState } from 'react';
import {
  Input, Radio, Checkbox, RadioChangeEvent, message, Button,
  Col,
  Row,
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
  searchableAndSelectableTextFields = undefined,
  selectedSearchableTextFields = [],
  setSelectedSearchableTextFields = () => null,
  searchTerm,
  handleSearchChange,
  inputSubtitle,
}) => {
  const [radioValue, setRadioValue] = useState('fullTextSearch');
  const [messageApi, contextHolder] = message.useMessage();
  const { hash } = window.location;
  const runCheckBoxUI = (hash.includes('#checkbox'));
  const runSearchButtonUI = (hash.includes('#searchButton'));

  const info = () => {
    if (runCheckBoxUI) messageApi.info('Updating search restrictions');
  };

  const onRadioChange = (e: RadioChangeEvent) => {
    setRadioValue(e.target.value);
    if (e.target.value === 'fullTextSearch') {
      info();
      setSelectedSearchableTextFields([]);
    }
  };

  const onCheckboxChange = (currentCheckedValue: string) => {
    info();

    if (selectedSearchableTextFields.includes(currentCheckedValue)) {
      const selectionsWithCurrentCheckedValueRemoved = selectedSearchableTextFields.filter(
        (value) => value !== currentCheckedValue,
      );
      setSelectedSearchableTextFields(selectionsWithCurrentCheckedValueRemoved);
    } else {
      setSelectedSearchableTextFields([...selectedSearchableTextFields, currentCheckedValue]);
    }
  };

  // LOGIC FOR SEARCH UI
  const [inputValue, setInputValue] = useState<string>('');
  // Event handler for input change
  const handleInputChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = ev.currentTarget;
    setInputValue(value); // Update the state with the input value
  };

  // Function to handle button click
  const handleButtonClick = () => {
    // Create a synthetic event to call handleSearchChange
    const syntheticEvent = {
      currentTarget: {
        value: inputValue, // Pass the current input value
      },
    } as React.ChangeEvent<HTMLInputElement>;
    handleSearchChange(syntheticEvent); // Call the original function with the synthetic event
  };

  return (
    <React.Fragment>
      {contextHolder}
      {!runSearchButtonUI
      && (
        <Input
          className='discovery-search'
          prefix={<SearchOutlined />}
          placeholder='Search studies by keyword...'
          value={searchTerm}
          onChange={handleSearchChange}
          size='large'
          allowClear
        />
      )}
      {/* SEARCH MODE */}
      {runSearchButtonUI && (
        <Row gutter={16} align='middle'>
          <Col span={19}>
            <Input
              className='discovery-search'
              prefix={<SearchOutlined />}
              placeholder='Search studies by keyword...'
              value={inputValue}
              onChange={handleInputChange}
              size='large'
              allowClear
            />
          </Col>
          <Col span={5}>
            <Button
              type='default'
              className='discovery-header__dropdown-tags-control-button'
              onClick={handleButtonClick}
            >Search
            </Button>
          </Col>
        </Row>
      )}
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
      <div style={{
        marginTop: '10px', padding: '10px', width: '100%', background: 'aliceblue',
      }}
      >  UI Test Modes:<br />
        <a href='#'>#normal</a><br />
        <a href='#checkbox'>#messages</a><br />
        <a href='#searchButton'>#searchButton</a>
      </div>
    </React.Fragment>
  );
};

DiscoveryMDSSearch.defaultProps = {
  searchableAndSelectableTextFields: undefined,
  selectedSearchableTextFields: [],
  setSelectedSearchableTextFields: () => null,
};

export default DiscoveryMDSSearch;
