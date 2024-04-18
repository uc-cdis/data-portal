import React, { useState } from 'react';
import DismissibleMessagesList from './DismissibleMessagesList';
import '../../GWASApp.css';

export default {
  title: 'Tests3/GWASApp/DismissibleMessageList/DismissibleMessagesList',
  component: DismissibleMessagesList,
};

const Template = (args) => {
  const [messages, setMessages] = useState([
    {
      title: 'success message 1',
      description: 'success one!',
      messageType: 'success',
    },
    {
      title: 'success message 2',
      description: 'success two!',
      messageType: 'success',
    },
    {
      title: 'warning message 1',
      description: 'warning one!',
      messageType: 'warning',
    },
    {
      title: 'caution message 1',
      description: 'caution one!',
      messageType: 'caution',
    },
  ]);
  return (
    <DismissibleMessagesList
      dismissMessage={(chosenMessage) => {
        const newMessages = messages.filter(
          (message) => message !== chosenMessage
        );
        setMessages(newMessages);
      }}
      messages={messages}
    />
  );
};

export const SuccessState = Template.bind({});
