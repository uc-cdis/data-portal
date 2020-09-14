import PropTypes from 'prop-types';
import React, { Component } from 'react';
import IconicLink from './buttons/IconicLink';
import './Introduction.less';
import { useArboristUI } from '../configs';
import { userHasMethodOnAnyProject } from '../authMappingUtils';

class Introduction extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    dictIcons: PropTypes.object.isRequired,
  };

  render() {
    let buttonText = 'Submit Data';
    if (useArboristUI) {
      if (userHasMethodOnAnyProject('create', this.props.userAuthMapping)) {
        buttonText = 'Submit/Browse Data';
      } else {
        buttonText = 'Browse Data';
      }
    }

    return (
      <div className='introduction'>
        <h1>
          <div className='h1-typo introduction__title'>
            {this.props.data.heading}
          </div>
        </h1>
        <div className='high-light introduction__text'>{this.props.data.text}</div>
        {(this.props.data.link) ?
          (<IconicLink
            link={this.props.data.link}
            dictIcons={this.props.dictIcons}
            className='introduction__icon'
            icon='upload'
            iconColor='#'
            caption={buttonText}
          />)
          : null}
      </div>
    );
  }
}

Introduction.propTypes = {
  userAuthMapping: PropTypes.object.isRequired,
};

export default Introduction;
