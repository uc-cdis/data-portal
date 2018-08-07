import PropTypes from 'prop-types';
import React from 'react';
import IconComponent from '../Icon';

class IconicButton extends React.Component {
  render() {
    let styles = {};
    if (this.props.iconColor && this.props.iconColor !== '') { styles = { fill: this.props.iconColor }; }
    return (
      this.props.dictIcons !== undefined ?
        <button
          className={this.props.buttonClassName}
          onClick={this.props.onClick}
          name={this.props.caption}
        >
          {this.props.caption}&ensp;
          <IconComponent
            dictIcons={this.props.dictIcons}
            iconName={this.props.icon}
            height='14px'
            svgStyles={{ ...styles }}
          />
        </button> :
        <button
          className={this.props.buttonClassName}
          onClick={this.props.onClick}
          name={this.props.caption}
        >
          {this.props.caption}
        </button>
    );
  }
}

IconicButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  dictIcons: PropTypes.object,
  icon: PropTypes.string,
  iconColor: PropTypes.string,
  caption: PropTypes.string,
  buttonClassName: PropTypes.string,
};

IconicButton.defaultProps = {
  dictIcons: undefined,
  icon: '',
  iconColor: '',
  caption: '',
  buttonClassName: 'button-primary-white',
};

export default IconicButton;
