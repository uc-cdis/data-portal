import { forwardRef, useImperativeHandle, useState } from 'react';
import PropTypes from 'prop-types';
import './AutoCompleteInput.css';

const AutoCompleteInput = forwardRef(
  /**
   * @param {Object} props
   * @param {string} [props.icon]
   * @param {string} [props.inputTitle]
   * @param {(input: string) => void} [props.onInputChange]
   * @param {(input: string) => void} [props.onSubmitInput]
   * @param {string} [props.placeHolderText]
   * @param {React.Ref<any>} ref
   */
  // eslint-disable-next-line prefer-arrow-callback
  function AutoCompleteInput(props, ref) {
    const {
      icon = 'search',
      inputTitle = 'Search Input',
      onInputChange,
      onSubmitInput,
      placeHolderText = 'Search',
    } = props;

    const [input, setInput] = useState('');

    useImperativeHandle(ref, () => ({
      setInputText: setInput,
      clearInput() {
        setInput('');
      },
    }));

    /** @param {React.SyntheticEvent} e */
    function handleSubmit(e) {
      e.preventDefault();
      onSubmitInput?.(input);
    }

    return (
      <div className='auto-complete-input'>
        <form className='auto-complete-input__form' onSubmit={handleSubmit}>
          <input
            value={input}
            title={inputTitle}
            className='auto-complete-input__input-box body'
            onChange={(e) => {
              const newInput = e.currentTarget.value;
              setInput(newInput);
              onInputChange?.(newInput);
            }}
            placeholder={placeHolderText}
          />
        </form>
        {input.length > 0 && (
          <>
            <span
              onClick={() => {
                setInput('');
                onInputChange?.('');
              }}
              onKeyPress={(e) => {
                if (e.charCode === 13 || e.charCode === 32) {
                  e.preventDefault();
                  setInput('');
                  onInputChange?.('');
                }
              }}
              role='button'
              tabIndex={0}
              aria-label='Clear'
            >
              <i className='g3-icon g3-icon--cross auto-complete-input__close' />
            </span>
            <i className='auto-complete-input__separator' />
          </>
        )}
        <span
          onClick={handleSubmit}
          onKeyPress={(e) => {
            if (e.charCode === 13 || e.charCode === 32) handleSubmit(e);
          }}
          role='button'
          tabIndex={0}
          aria-label='Search'
        >
          <i className={`g3-icon g3-icon--${icon} auto-complete-input__icon`} />
        </span>
      </div>
    );
  }
);

AutoCompleteInput.propTypes = {
  onInputChange: PropTypes.func,
  placeHolderText: PropTypes.string,
  icon: PropTypes.string,
  onSubmitInput: PropTypes.func,
  inputTitle: PropTypes.string,
};

export default AutoCompleteInput;
