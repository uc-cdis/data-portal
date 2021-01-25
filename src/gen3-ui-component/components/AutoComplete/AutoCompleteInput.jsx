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

  setInputText(text) {
    this.inputElem.current.value = text;
    this.updateCloseIcon();
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

  updateCloseIcon() {
    const currentInput = this.inputElem.current.value;
    this.setState({
      closeIconHidden: !currentInput || currentInput.length === 0,
    });
  }

  handleSubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    this.props.onSubmitInput(this.inputElem.current.value);
  }

  clearInput() {
    this.inputElem.current.value = '';
    this.updateCloseIcon();
  }

  render() {
    return (
      <div className='auto-complete-input'>
        <form className='auto-complete-input__form' onSubmit={e => this.handleSubmit(e)}>
          <input
            title={this.props.inputTitle}
            className='auto-complete-input__input-box body'
            onChange={() => { this.handleChange(); }}
            placeholder={this.props.placeHolderText}
            ref={this.inputElem}
          />
        </form>
        {
          !this.state.closeIconHidden && (
            <React.Fragment>
              <i
                className='g3-icon g3-icon--cross auto-complete-input__close'
                onClick={() => { this.handleClear(); }}
                onKeyPress={() => { this.handleClear(); }}
                role='button'
                tabIndex={0}
              />
              <i className='auto-complete-input__separator' />
            </React.Fragment>
          )
        }
        <i
          className={`g3-icon g3-icon--${this.props.icon} auto-complete-input__icon`}
          onClick={() => this.handleSubmit()}
          onKeyPress={() => this.handleSubmit()}
          role='button'
          tabIndex={0}
        />
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
