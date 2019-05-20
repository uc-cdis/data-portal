import React from 'react';
import PropTypes from 'prop-types';
import Button from '@gen3/ui-component/dist/components/Button';
import './ExplorerTopMessageBanner.css';
import { checkForNoAccessibleProject } from '../GuppyDataExplorerHelper';
import { GuppyConfigType } from '../configTypeDef';

class ExplorerTopMessageBanner extends React.Component {
  render() {
    return (
      <div className={this.props.className}>
        {
          (this.props.tierAccessLevel === 'regular' && checkForNoAccessibleProject(this.props.accessibleFieldObject, this.props.guppyConfig.accessibleValidationField)) ? (
            <div className='top-message-banner'>
              <div className='top-message-banner__button-wrapper'>
                <Button
                  label='Get Access'
                  className='top-message-banner__button'
                  buttonType='default'
                  onClick={
                    (this.props.getAccessButtonLink) ? (
                      () => { window.open(this.props.getAccessButtonLink); }
                    ) : (() => {})
                  }
                />
              </div>
              <span className='top-message-banner__normal-text'>Due to lack of access, you are only able to narrow the cohort down to </span>
              <span className='top-message-banner__bold-text'>{ this.props.tierAccessLimit } </span>
              <span className='top-message-banner__normal-text'>
                {this.props.guppyConfig.nodeCountTitle.toLowerCase()
                  || this.props.guppyConfig.dataType}.
                  Please request additional access if necessary.
              </span>
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
  guppyConfig: {},
};

export default ExplorerTopMessageBanner;
