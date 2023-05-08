import PropTypes from 'prop-types';
import './ButtonToggle.css';

/**
 * @param {Object} props
 * @param {boolean} [props.isOn]
 * @param {({ isOn, value }: { isOn: boolean, value: any}) => void} [props.onToggle]
 * @param {string} [props.onText]
 * @param {any} [props.onValue]
 * @param {string} [props.offText]
 * @param {any} [props.offValue]
 */
function ButtonToggle({
    isOn,
    onToggle,
    onText,
    onValue = onText,
    offText,
    offValue = offText
}) {
    let handleOnChange = e => {
        let isOn = e.target.value === 'ON';
        let params = { 
            isOn,
            value: isOn ? onValue : offValue 
        };
        onToggle(params);
    };
    return <div className='button-toggle'>
        <label className={isOn ? 'active' : undefined}>
            <input
                name='toggleOn'
                value='ON'
                type='radio'
                onChange={handleOnChange}
                checked={isOn}
            />
            {onText}
        </label>
        <label className={!isOn ? 'active' : undefined}>
            <input
                name='toggleOff'
                value='OFF'
                type='radio'
                onChange={handleOnChange}
                checked={!isOn}
            />
            {offText}
        </label>
    </div>;
}

ButtonToggle.propTypes = {
    isOn: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
    onText: PropTypes.string.isRequired,
    offText: PropTypes.string.isRequired,
    onValue: PropTypes.any,
    offValue: PropTypes.any
};

export default ButtonToggle;
