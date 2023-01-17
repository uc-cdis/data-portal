import React from 'react';
import { PropTypes } from 'prop-types';
import DismissibleMessage from './DismissibleMessage';

// Messages in messages list need to follow this format:
//   {
//       title = 'Placeholder Title',
//       description = 'placeholder description',
//       messageType = 'success', (or 'warning')
//   },

const DismissibleMessagesList = ({ messages, dismissMessage }) => (
  <div className='GWASV2'>
    {messages.map((message, key) => (
      <React.Fragment key={message + key}>
        <DismissibleMessage
          title={message.title}
          description={message.description}
          messageType={message.messageType}
          dismissMessage={() => {
            dismissMessage(message);
          }}
        />
      </React.Fragment>
    ))}
  </div>
);

DismissibleMessagesList.propTypes = {
  messages: PropTypes.array,
  dismissMessage: PropTypes.func.isRequired,
};
DismissibleMessagesList.defaultProps = {
  messages: [],
};

export default DismissibleMessagesList;
