import PropTypes from 'prop-types';
import Button from '../../gen3-ui-component/components/Button';

/**
 * @typedef {Object} ExplorerRequestAccessButtonProps
 * @property {function} onClick
 * @property {string} tooltipText
 */

/** @param {ExplorerRequestAccessButtonProps} props */
function ExplorerRequestAccessButton({ onClick, tooltipText }) {
  return (
    <Button
      buttonType='secondary'
      label='Request Access'
      onClick={(e) => onClick(e)}
      rightIcon='key'
      tooltipEnabled={!!tooltipText}
      tooltipText={tooltipText}
    />
  );
}

ExplorerRequestAccessButton.propTypes = {
  getAccessButtonLink: PropTypes.string,
  tooltipText: PropTypes.string,
};

export default ExplorerRequestAccessButton;
