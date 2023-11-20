import React from 'react';
import {
  Input, Button, Alert, Divider, List
} from 'antd';
import type CollapseProps from 'antd';
import { SearchOutlined, RobotFilled } from '@ant-design/icons';
import {
  fetchGen3DiscoveryAIResponse
} from '../actions';

const DiscoveryMDSSearch = (props: { searchTerm, handleSearchChange, inputSubtitle}) => (
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
  </React.Fragment>
);

class DiscoveryChatbot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      response: '',
      chatbotSearchTerm: props.chatbotSearchTerm,
      handleChatbotSearchChange: props.handleChatbotSearchChange,
      handleChatbotResponse: props.handleChatbotResponse,
      chatbotInputSubtitle: props.chatbotInputSubtitle,
      items: []
    };
  }

  handleClick = () => {
    fetchGen3DiscoveryAIResponse(this.state.chatbotSearchTerm).then(
      (res) => {
        let newResponse = res;
        if (res === null) {
          newResponse = {
            "response": "Error when attempting to use the AI. Please ensure you're logged in and have proper permission.",
            "sources": []
          }
        }
        this.setState({ response: newResponse }, () => {
          console.log('response updated:', newResponse);
          console.log('response updated:', newResponse.documents);

          let newArray = []
          newResponse.documents.map((doc) => {
            newArray.push(doc.metadata.source);
          });
          this.setState({ items: newArray });
        });

        let newSearch = this.state.items.join(", ");
        this.state.handleChatbotResponse(newSearch);
      }
    );
  };

  handleInputChange = (ev) => {
    this.setState({ chatbotSearchTerm: event.target.value });
  };

  render() {
    return (
      <React.Fragment>
        <Input
          className='discovery-chatbot'
          prefix={<RobotFilled />}
          placeholder='Ask AI about available data...'
          value={this.state.chatbotSearchTerm}
          onChange={this.handleInputChange}
          size='large'
          allowClear
        />
        <div className='discovery-chatbot-input-subtitle'>{this.state.chatbotInputSubtitle}</div>
        <Button
            type='default'
            onClick={this.handleClick}
            icon={<SearchOutlined />}
          >
          {'Ask AI'}
        </Button>
        <Divider
          plain
          style={this.state.response.response ? {} : { 'display': 'none' }}
        />
        <Alert
          className='discovery-chatbot-response'
          style={this.state.response.response ? {} : { 'display': 'none' }}
          message="AI Response"
          description={this.state.response.response}
          type="info"
          showIcon
          closable // figure out how to reenable this after closing and a new reponse comes in
        />
        <Alert
          className='discovery-chatbot-response'
          style={this.state.response.response ? {} : { 'display': 'none' }}
          message="Referenced Sources"
          description={this.state.items.map(item => item).join(', ')}
          type="warning"
          showIcon
          closable // figure out how to reenable this after closing and a new reponse comes in
        />
      </React.Fragment>
    );
  }
}

export { DiscoveryMDSSearch, DiscoveryChatbot };