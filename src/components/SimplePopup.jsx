import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import './SimplePopup.css';

/**
 * @typedef {Object} SimplePopupPops
 * @property {React.ReactNode} props.children
 */

/** @param {SimplePopupPops} props */
function SimplePopup({ children }) {
  return <>
    {ReactDOM.createPortal(
    <div className='simple-popup__overlay'>
      <div className='simple-popup__main'>{children}</div>
    </div>,
    document.getElementById('root')
    )}
  </>
}

SimplePopup.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export default SimplePopup;
