import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import React from 'react';
import IconComponent from '../Icon';

class IconicLink extends React.Component {
  renderButton(styles) {
    return (
      <React.Fragment>
        {
          this.props.dictIcons !== undefined
            ? (
              <button className={this.props.buttonClassName} type='button'>
                {this.props.caption}&ensp;
                <IconComponent
                  dictIcons={this.props.dictIcons}
                  iconName={this.props.icon}
                  height='14px'
                  svgStyles={{ ...styles }}
                />
              </button>
            )
            : (
              <button className={this.props.buttonClassName} type='button'>
                {this.props.caption}
              </button>
            )
        }
      </React.Fragment>
    );
  }

  render() {
    let styles = {};
    if (this.props.iconColor && this.props.iconColor !== '') { styles = { fill: this.props.iconColor }; }
    if (this.props.isExternal) {
      return (
        <a href={this.props.link} target={this.props.target} className={this.props.className}>
          { this.renderButton(styles) }
        </a>
      );
    }
    return (
      <Link className={this.props.className} to={this.props.link} target={this.props.target}>
        { this.renderButton(styles) }
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
  target: PropTypes.string,
  isExternal: PropTypes.bool,
};

IconicLink.defaultProps = {
  dictIcons: undefined,
  icon: '',
  iconColor: '',
  caption: '',
  buttonClassName: 'g3-button button-primary-white',
  className: '',
  target: '',
  isExternal: false,
};

export default IconicLink;
