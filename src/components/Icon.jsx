import PropTypes from 'prop-types';

/**
 * @typedef {Object} IconComponentProps
 * @property {{ [iconName: string]: (height: string, style: Object) => JSX.Element }} dictIcons
 * @property {string} iconName
 * @property {string} [height]
 * @property {Object} [style]
 */

/** @param {IconComponentProps} props */
function IconComponent({ dictIcons, iconName, height = '27px', style = {} }) {
  return dictIcons[iconName](height, style);
}

IconComponent.propTypes = {
  dictIcons: PropTypes.objectOf(PropTypes.func).isRequired,
  iconName: PropTypes.string.isRequired,
  height: PropTypes.string,
  style: PropTypes.object,
};

export default IconComponent;
