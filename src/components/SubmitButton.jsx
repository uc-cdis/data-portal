import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import IconComponent from './Icon';
import { localTheme } from '../localconf';
import React from 'react';


class SubmitButton extends React.Component {
  render() {
    console.log(this.props.dictIcons);
    return (
      <Link to={this.props.link}>
        {
          this.props.dictIcons !== undefined ?
            <button className={this.props.buttonClassName}>
              Submit Data&emsp;
              <IconComponent dictIcons={this.props.dictIcons} iconName='upload' height="14px"/>
            </button> :
            <button className={this.props.buttonClassName}>
              Submit Data
            </button>
        }

      </Link>
    );
  }
}

SubmitButton.propTypes = {
  link: PropTypes.string.isRequired,
  dictIcons: PropTypes.object,
};

SubmitButton.defaultProps = {
  dictIcons: undefined,
  buttonClassName: 'button-primary-white',
};

export default SubmitButton;
