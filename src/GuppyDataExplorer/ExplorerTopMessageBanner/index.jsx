import React from 'react';
import PropTypes from 'prop-types';
import Button from '@gen3/ui-component/dist/components/Button';
import './ExplorerTopMessageBanner.css';
import { checkForNoAccessibleProject } from '../GuppyDataExplorerHelper';
import { GuppyConfigType } from '../configTypeDef';
import { labelToPlural } from '../utils';

class ExplorerTopMessageBanner extends React.Component {
  render() {
    const { hideGetAccessButton } = this.props;
    return (
      <div className={this.props.className}>
        {
          (this.props.tierAccessLevel === 'regular' && checkForNoAccessibleProject(this.props.accessibleFieldObject, this.props.guppyConfig.accessibleValidationField)) ? (
            <div className='top-message-banner'>
              <div className='top-message-banner__space-column' />
              <div className='top-message-banner__text-column'>
                <div className='top-message-banner__button-wrapper'>
                  { (hideGetAccessButton) ? (<React.Fragment />)
                    : (
                      <Button
                        label='Get Access'
                        className='top-message-banner__button'
                        buttonType='default'
                        enabled={!!(this.props.getAccessButtonLink)}
                        tooltipEnabled={!(this.props.getAccessButtonLink)}
                        tooltipText='Coming soon'
                        onClick={
                          (this.props.getAccessButtonLink) ? (
                            () => { window.open(this.props.getAccessButtonLink); }
                          ) : (() => {})
                        }
                      />
                    )}
                </div>
                <div className='top-message-banner__text-wrapper'>
                  <span className='top-message-banner__normal-text'>Due to lack of access, you are only able to narrow the cohort down to </span>
                  <span className='top-message-banner__bold-text'>{ this.props.tierAccessLimit } </span>
                  <span className='top-message-banner__normal-text'>
                    {this.props.guppyConfig.nodeCountTitle
                      ? this.props.guppyConfig.nodeCountTitle.toLowerCase()
                      : labelToPlural(this.props.guppyConfig.dataType)}.
                  Please request additional access if necessary.
                  </span>
                </div>
              </div>
            </div>
          ) : (<React.Fragment />)
        }
      </div>
    );
  }
}

ExplorerTopMessageBanner.propTypes = {
  className: PropTypes.string,
  getAccessButtonLink: PropTypes.string,
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
  hideGetAccessButton: false,
  guppyConfig: {},
};

export default ExplorerTopMessageBanner;
