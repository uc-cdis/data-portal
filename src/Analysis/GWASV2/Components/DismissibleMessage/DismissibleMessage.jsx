import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './DismissibleMessage.css';

const DismissibleMessage = ({
  title = 'Placeholder Title',
  description = 'placeholder description',
  messageType = 'success',
}) => {
  const [open, setOpen] = useState(true);
  const isEnterOrSpace = (event) => event.key === 'Enter'
    || event.key === ' '
    || event.key === 'Spacebar'
    || event.keycode === '32'
    || event.keycode === '13';

  return (
    <React.Fragment>
      {open === true && (
        <div className={`dismissable-message ${messageType}`}>
          <span
            className='dismissable-message_close'
            tabIndex='0'
            role='button'
            aria-label='Close Message'
            onClick={() => {
              setOpen(false);
            }}
            onKeyDown={(e) => {
              if (isEnterOrSpace(e)) setOpen(false);
            }}
          >
            X
          </span>
          <div>{title}</div>
          <div>{description}</div>
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
