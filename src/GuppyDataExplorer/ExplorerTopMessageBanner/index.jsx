import React from 'react';
import PropTypes from 'prop-types';
import './ExplorerTopMessageBanner.css';
import { checkForNoAccessibleProject } from '../GuppyDataExplorerHelper';

class ExplorerTopMessageBanner extends React.Component {
  render() {
    return (
      <div className={this.props.className}>
        {
          (this.props.tierAccessLevel === 'regular' && checkForNoAccessibleProject(this.props.accessibleFieldObject)) ? (
            <div className='top-message-banner'>
              <div className='top-message-banner__button-wrapper'>
                { this.props.renderGetAccessButton() }
              </div>
              <span className='top-message-banner__normal-text'>To protect data security, you can only narrow the cohort down to </span>
              <span className='top-message-banner__bold-text'>{ this.props.tierAccessLimit }</span>
              <span className='top-message-banner__normal-text'> subjects. Please request access to work with data you need.</span>
            </div>
          ) : (<React.Fragment />)
        }
      </div>
    );
  }
}

ExplorerTopMessageBanner.propTypes = {
  className: PropTypes.string,
  tierAccessLevel: PropTypes.string.isRequired,
  tierAccessLimit: PropTypes.number, // inherit from GuppyWrapper
  accessibleFieldObject: PropTypes.object, // inherit from GuppyWrapper
  renderGetAccessButton: PropTypes.func,
};

ExplorerTopMessageBanner.defaultProps = {
  className: '',
  tierAccessLimit: undefined,
  accessibleFieldObject: {},
  renderGetAccessButton: () => {},
};

export default ExplorerTopMessageBanner;
