import PropTypes from 'prop-types';

const IconComponent = ({ dictIcons, iconName, height, svgStyles }) => (
  dictIcons[iconName](height, svgStyles)
);

IconComponent.propTypes = {
  iconName: PropTypes.string.isRequired,
  dictIcons: PropTypes.object.isRequired,
  height: PropTypes.string,
  svgStyles: PropTypes.object,
};

IconComponent.defaultProps = {
  height: '27px',
  svgStyles: {},
};

export default IconComponent;
