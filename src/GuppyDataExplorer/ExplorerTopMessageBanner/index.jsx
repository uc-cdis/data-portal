import React from 'react';
import PropTypes from 'prop-types';
import Button from '../../gen3-ui-component/components/Button';
import './ExplorerTopMessageBanner.css';
import { GuppyConfigType } from '../configTypeDef';

class ExplorerTopMessageBanner extends React.Component {
  render() {
    return this.props.hideBanner ? null : (
      <div className={this.props.className}>
        <div className='top-message-banner'>
          <div className='top-message-banner__space-column' />
          <div className='top-message-banner__text-column'>
            <div className='top-message-banner__button-wrapper'>
              {this.props.hideGetAccessButton ? null : (
                <Button
                  label='Get Access'
                  className='top-message-banner__button'
                  buttonType='default'
                  enabled={!!this.props.getAccessButtonLink}
                  tooltipEnabled={!this.props.getAccessButtonLink}
                  tooltipText='Coming soon'
                  onClick={
                    this.props.getAccessButtonLink &&
                    window.open(this.props.getAccessButtonLink)
                  }
                />
              )}
            </div>
            <div className='top-message-banner__text-wrapper'>
              <span className='top-message-banner__normal-text'>
                You do not have permissions to view line-level data. To request
                access please reach out to the PCDC team.
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ExplorerTopMessageBanner.propTypes = {
  className: PropTypes.string,
  getAccessButtonLink: PropTypes.string,
  hideBanner: PropTypes.bool,
  hideGetAccessButton: PropTypes.bool,
  tierAccessLevel: PropTypes.string.isRequired,
  tierAccessLimit: PropTypes.number,
  accessibleFieldObject: PropTypes.object, // inherit from GuppyWrapper
  guppyConfig: GuppyConfigType,
};

ExplorerTopMessageBanner.defaultProps = {
  className: '',
  tierAccessLimit: undefined,
  accessibleFieldObject: {},
  getAccessButtonLink: undefined,
  hideBanner: true,
  hideGetAccessButton: false,
  guppyConfig: {},
};

export default ExplorerTopMessageBanner;
