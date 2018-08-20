import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import dictIcons from '../img/icons/index';
import IconComponent from '../components/Icon';
import './BackLink.less';

class BackLink extends Component {
  render() {
    return (
      <Link to={this.props.url}>
        <br />
        <div className='back-link'>
          <IconComponent
            dictIcons={dictIcons}
            iconName='back'
            height='12px'
          />
        </div>
        <div className='back-link'>{this.props.label}</div>
      </Link>
    );
  }
}

BackLink.propTypes = {
  url: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default BackLink;
