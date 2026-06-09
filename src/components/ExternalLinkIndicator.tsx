import React from 'react';
// import { ExternalLinkSVG } from '../img/icons/external-link-indicator.svg';
import ExternalLinkIcon from '../img/icons/external-link-indicator.svg';

// 2. Apply the type to the props object
const ExternalLinkIndicator = ({ className = '' }) => (
  <React.Fragment>
    <span
      aria-hidden='true'
      className={`inline-block ${className}`.trim()}
      data-testid='external-link-indicator'
      aria-label='opens in a new window'
      style={{ marginTop: '5px' }}
    >
      <ExternalLinkIcon />
    </span>
  </React.Fragment>
);
export default ExternalLinkIndicator;
