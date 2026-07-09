import React from 'react';
import PropTypes from 'prop-types';
import './TopIconButton.less';
import ExternalLinkIndicator from '../ExternalLinkIndicator';

const TopIconButton = ({
  name, icon, isActive = false, isExternalLink = false,
}) => (
  <div
    className={isActive ? 'top-icon-button button-top-active body-typo' : 'top-icon-button body-typo'}
  >
    {name}&nbsp;{icon ? (
      <i
        className={`g3-icon g3-icon--${icon} top-icon-button__icon`}
      />
    ) : ''}
    {isExternalLink && <ExternalLinkIndicator />}
  </div>
);

TopIconButton.propTypes = {
  name: PropTypes.string.isRequired,
  icon: PropTypes.string,
  isActive: PropTypes.bool,
  isExternalLink: PropTypes.bool,
};

TopIconButton.defaultProps = {
  icon: null,
  isActive: false,
  isExternalLink: false,
};

export default TopIconButton;
