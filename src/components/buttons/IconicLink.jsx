import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import React from 'react';
import IconComponent from '../Icon';


class IconicLink extends React.Component {
  render() {
    let styles = {};
    if (this.props.iconColor && this.props.iconColor !== '') { styles = { fill: this.props.iconColor }; }
    return (
      <Link className={this.props.className} to={this.props.link}>
        {
          this.props.dictIcons !== undefined ?
            <button className={this.props.buttonClassName}>
              {this.props.caption}&ensp;
              <IconComponent
                dictIcons={this.props.dictIcons}
                iconName={this.props.icon}
                height='14px'
                svgStyles={{ ...styles }}
              />
            </button> :
            <button className={this.props.buttonClassName}>
              {this.props.caption}
            </button>
        }
      </Link>
    );
  }
}

IconicLink.propTypes = {
  link: PropTypes.string.isRequired,
  dictIcons: PropTypes.object,
  icon: PropTypes.string,
  iconColor: PropTypes.string,
  caption: PropTypes.string,
  buttonClassName: PropTypes.string,
  className: PropTypes.string,
};

IconicLink.defaultProps = {
  dictIcons: undefined,
  icon: '',
  iconColor: '',
  caption: '',
  buttonClassName: 'button-primary-white',
  className: '',
};

export default IconicLink;
