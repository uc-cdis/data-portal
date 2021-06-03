import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './AutoCompleteInput.css';

class AutoCompleteInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      closeIconHidden: true,
    };
    this.inputElem = React.createRef();
  }

  handleChange() {
    const currentInput = this.inputElem.current.value;
    this.props.onInputChange(currentInput);
    this.updateCloseIcon();
  }

  handleClear() {
    this.inputElem.current.value = '';
    this.updateCloseIcon();
    this.props.onInputChange('');
  }

  handleSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    this.props.onSubmitInput(this.inputElem.current.value);
  }

  setInputText(text) {
    this.inputElem.current.value = text;
    this.updateCloseIcon();
  }

  clearInput() {
    this.inputElem.current.value = '';
    this.updateCloseIcon();
  }

  updateCloseIcon() {
    const currentInput = this.inputElem.current.value;
    this.setState({
      closeIconHidden: !currentInput || currentInput.length === 0,
    });
  }

  render() {
    return (
      <div className='auto-complete-input'>
        <form
          className='auto-complete-input__form'
          onSubmit={(e) => this.handleSubmit(e)}
        >
          <input
            title={this.props.inputTitle}
            className='auto-complete-input__input-box body'
            onChange={() => {
              this.handleChange();
            }}
            placeholder={this.props.placeHolderText}
            ref={this.inputElem}
          />
        </form>
        {!this.state.closeIconHidden && (
          <>
            <span
              onClick={() => {
                this.handleClear();
              }}
              onKeyPress={(e) => {
                if (e.charCode === 13 || e.charCode === 32) {
                  e.preventDefault();
                  this.handleClear();
                }
              }}
              role='button'
              tabIndex={0}
            >
              <i className='g3-icon g3-icon--cross auto-complete-input__close' />
            </span>
            <i className='auto-complete-input__separator' />
          </>
        )}
        <span
          onClick={() => this.handleSubmit()}
          onKeyPress={(e) => {
            if (e.charCode === 13 || e.charCode === 32) {
              e.preventDefault();
              this.handleSubmit();
            }
          }}
          role='button'
          tabIndex={0}
        >
          <i
            className={`g3-icon g3-icon--${this.props.icon} auto-complete-input__icon`}
          />
        </span>
      </div>
    );
  }
}

AutoCompleteInput.propTypes = {
  onInputChange: PropTypes.func,
  placeHolderText: PropTypes.string,
  icon: PropTypes.string,
  onSubmitInput: PropTypes.func,
  inputTitle: PropTypes.string,
};

AutoCompleteInput.defaultProps = {
  onInputChange: () => {},
  placeHolderText: 'Search',
  icon: 'search',
  onSubmitInput: () => {},
  inputTitle: 'Search Input',
};

export default AutoCompleteInput;
