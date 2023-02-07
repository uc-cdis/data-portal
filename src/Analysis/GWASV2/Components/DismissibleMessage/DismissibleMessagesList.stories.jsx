import React, { useState } from 'react';
import DismissibleMessagesList from './DismissibleMessagesList';
import '../../GWASV2.css';

export default {
  title: 'Tests3/GWASV2/DismissibleMessage/DismissibleMessagesList',
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
  ]);
  return <DismissibleMessagesList
    dismissMessage={(chosenMessage) => {
      const newMessages = messages.filter(
        (message) => message !== chosenMessage,
      );
      setMessages(newMessages);
    }}
    messages={messages}
  />
};

export const SuccessState = Template.bind({});
