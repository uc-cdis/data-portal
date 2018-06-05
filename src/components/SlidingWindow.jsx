import PropTypes from 'prop-types';

const SlidingWindow = ({
  dictIcons, iconName,
  height, width,
  scrollX, scrollY, svgStyles,
}) => dictIcons[iconName](height, width, scrollX, scrollY, svgStyles);

SlidingWindow.propTypes = {
  iconName: PropTypes.string.isRequired,
  dictIcons: PropTypes.object.isRequired,
  scrollX: PropTypes.number,
  scrollY: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  svgStyles: PropTypes.object,
};

SlidingWindow.defaultProps = {
  scrollX: 0,
  scrollY: 0,
  width: 0,
  height: 27,
  svgStyles: {},
};

export default SlidingWindow;
