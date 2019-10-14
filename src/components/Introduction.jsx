import PropTypes from 'prop-types';
import React, { Component } from 'react';
import IconicLink from './buttons/IconicLink';
import './Introduction.less';
import { useArboristUI } from '../configs';

class Introduction extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    dictIcons: PropTypes.object.isRequired,
  };

  userHasCreateForAnyProject = () => {
    const actionHasCreate = x => { return (x["method"] === "create") }
    //array of arrays of { service: x, method: y }
    var actionArrays = Object.values(this.props.userAuthMapping)
    var hasCreate = actionArrays.some(x => { return x.some(actionHasCreate) })
    return hasCreate
  }

  render() {
    var buttonText = 'Submit Data'
    if (useArboristUI) {
      if (this.userHasCreateForAnyProject()) {
        buttonText = 'Submit/Browse Data'
      } else {
        buttonText = 'Browse Data'
      }
    }

    return (
      <div className='introduction'>
        <div className='h1-typo introduction__title'>{this.props.data.heading}</div>
        <div className='high-light introduction__text'>{this.props.data.text}</div>
        <IconicLink
          link={this.props.data.link}
          dictIcons={this.props.dictIcons}
          className='introduction__icon'
          icon='upload'
          iconColor='#'
          caption={buttonText}
        />
      </div>
    );
  }
}

Introduction.propTypes = {
  userAuthMapping: PropTypes.object.isRequired,
};

export default Introduction;
