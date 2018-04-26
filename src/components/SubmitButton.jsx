import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import IconComponent from './Icon';
import React from 'react';


class SubmitButton extends React.Component {
  render() {
    let styles = {};
    if (this.props.iconColor && this.props.iconColor !== '') { styles = { fill: this.props.iconColor }; }
    return (
      <Link to={this.props.link}>
        {
          this.props.dictIcons !== undefined ?
            <button className={this.props.buttonClassName}>
              Submit Data&ensp;
              <IconComponent
                dictIcons={this.props.dictIcons}
                iconName="upload"
                height="14px"
                svgStyles={{ ...styles }}
              />
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
  buttonClassName: PropTypes.string,
  iconColor: PropTypes.string,
};

SubmitButton.defaultProps = {
  dictIcons: undefined,
  buttonClassName: 'button-primary-white',
  iconColor: '',
};

export default SubmitButton;
