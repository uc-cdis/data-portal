import React from 'react';
import ExternalLinkIcon from '../img/icons/external-link-indicator.svg';

const ExternalLinkIndicator = ({ className = '' }) => (
  <React.Fragment>
    <span
      className={`inline-block ${className}`.trim()}
      aria-label='opens in a new window'
    >
      <ExternalLinkIcon />
    </span>
  </React.Fragment>
);
export default ExternalLinkIndicator;
