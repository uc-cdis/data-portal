import React from 'react';
import PropTypes from 'prop-types';
import Button from '@gen3/ui-component/dist/components/Button';
import './Toaster.less';

class Toaster extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      closed: false,
    };
  }

  onClose = () => {
    this.props.onCloseButton();
    this.setState({ closed: true });
  }

  render() {
    const closeButton = this.props.hasCloseButton &&
    (
      <Button
        className='toaster__button'
        onClick={this.onClose}
        label={this.props.closeButtonText}
        buttonType='secondary'
      />
    );
    const actionButton = this.props.hasActionButton &&
    (
      <Button
        className='toaster__button'
        onClick={this.props.onActionButton}
        label={this.props.actionButtonText}
        buttonType='primary'
        isPending={this.props.actionButtonIsPending}
      />
    );

    return this.props.isEnabled ?
      (
        <div className='toaster__div'>
          {closeButton}
          {actionButton}
          <div className='toaster__div-text'>
            <div> {this.props.primaryText} </div>
            <div> {this.props.otherText} </div>
          </div>
        </div>
      )
      :
      null
    ;
  }
}

Toaster.propTypes = {
  isEnabled: PropTypes.bool.isRequired,
  primaryText: PropTypes.string,
  otherText: PropTypes.string,
  hasCloseButton: PropTypes.bool,
  onCloseButton: PropTypes.func,
  closeButtonText: PropTypes.string,
  hasActionButton: PropTypes.bool,
  onActionButton: PropTypes.func,
  actionButtonIsPending: PropTypes.bool,
  actionButtonText: PropTypes.string,
};

Toaster.defaultProps = {
  primaryText: '',
  otherText: '',
  hasCloseButton: false,
  onCloseButton: null,
  closeButtonText: 'Okay',
  hasActionButton: false,
  onActionButton: null,
  actionButtonIsPending: false,
  actionButtonText: 'Go',
};

export default Toaster;
