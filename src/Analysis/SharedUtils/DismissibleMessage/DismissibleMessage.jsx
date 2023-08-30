import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './DismissibleMessage.css';
import isEnterOrSpace from '../IsEnterOrSpace';

const DismissibleMessage = ({
  title = 'Placeholder Title',
  description = 'placeholder description',
  messageType = 'success',
}) => {
  const [open, setOpen] = useState(true);

  const close = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      {open === true && (
        <div className={`dismissable-message ${messageType}`}>
          <span
            className='dismissable-message_close'
            tabIndex='0'
            role='button'
            aria-label='Close Message'
            onClick={close}
            onKeyDown={(e) => {
              if (isEnterOrSpace(e)) close();
            }}
          >
            X
          </span>
          <div>{title}</div>
          <div className='dismissable-message-description'>{description}</div>
        </div>
      )}
    </React.Fragment>
  );
};

DismissibleMessage.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  messageType: PropTypes.string,
};

DismissibleMessage.defaultProps = {
  description: '',
  messageType: 'success',
};

export default DismissibleMessage;
