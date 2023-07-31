import PropTypes from 'prop-types';
import Tooltip from 'rc-tooltip';
import Spinner from '../Spinner/Spinner';
import 'rc-tooltip/assets/bootstrap_white.css';
import './Button.css';

/**
 * @param {Object} props
 * @param {'primary' | 'secondary' | 'default'} [props.buttonType]
 * @param {string} [props.className]
 * @param {boolean} [props.enabled]
 * @param {string} [props.id]
 * @param {boolean} [props.isPending]
 * @param {string | JSX.Element} props.label
 * @param {string} [props.leftIcon]
 * @param {React.MouseEventHandler} [props.onClick]
 * @param {string} [props.rightIcon]
 * @param {boolean} [props.tooltipEnabled]
 * @param {string} [props.tooltipText]
 * @param {string} [props.value]
 * @param {boolean}[props.submit]
 * @param {boolean | "dialog"} [props.hasPopup]
 */
function Button({
  buttonType = 'primary',
  className = '',
  enabled = true,
  id,
  isPending,
  label,
  leftIcon,
  onClick,
  rightIcon,
  tooltipEnabled = false,
  tooltipText,
  value,
  submit = false,
  hasPopup = false
}) {
  function handleClick(e) {
    if (enabled && !isPending) onClick?.(e);
  }

  const buttonTypeClassName =
    !enabled || isPending ? 'g3-button--disabled' : `g3-button--${buttonType}`;
  const buttonElement = (
    <button
      type={submit ? 'submit': 'button'}
      className={`${className} g3-button ${buttonTypeClassName}`}
      onClick={handleClick}
      onKeyPress={(e) => e.stopPropagation()}
      id={id}
      value={value}
      aria-haspopup={hasPopup}
    >
      {leftIcon && (
        <i
          className={`g3-icon g3-icon--sm g3-icon--${leftIcon} g3-button__icon g3-button__icon--left`}
        />
      )}
      {label}
      {rightIcon && !isPending && (
        <i
          className={`g3-icon g3-icon--sm g3-icon--${rightIcon} g3-button__icon g3-button__icon--right`}
        />
      )}
      {isPending && (
        <div className='g3-button__spinner g3-button__icon--right'>
          <Spinner />
        </div>
      )}
    </button>
  );

  return tooltipEnabled ? (
    <Tooltip
      placement='bottom'
      overlay={tooltipText}
      arrowContent={<div className='rc-tooltip-arrow-inner' />}
    >
      {buttonElement}
    </Tooltip>
  ) : (
    buttonElement
  );
}

Button.propTypes = {
  buttonType: PropTypes.oneOf(['primary', 'secondary', 'default']),
  enabled: PropTypes.bool,
  className: PropTypes.string,
  id: PropTypes.string,
  isPending: PropTypes.bool,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  leftIcon: PropTypes.string,
  onClick: PropTypes.func,
  rightIcon: PropTypes.string,
  tooltipEnabled: PropTypes.bool,
  tooltipText: PropTypes.string,
  value: PropTypes.string,
  submit: PropTypes.bool,
  hasPopup: PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
};

export default Button;
