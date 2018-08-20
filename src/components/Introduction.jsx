import PropTypes from 'prop-types';
import React, { Component } from 'react';
import IconicLink from './buttons/IconicLink';
import './Introduction.less';

class Introduction extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    dictIcons: PropTypes.object.isRequired,
  };

  render() {
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
          caption='Submit Data'
        />
      </div>
    );
  }
}

export default Introduction;
