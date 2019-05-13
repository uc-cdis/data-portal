import React from 'react';
import PropTypes from 'prop-types';
import Button from '@gen3/ui-component/dist/components/Button';
import './WorkspaceOption.css';

class WorkspaceOption extends React.Component {
  render() {
    const Icon = this.props.icon;
    return (
      <div className='workspace-option'>
        <Icon className='workspace-option__icon' />
        <h3 className='workspace-option__title'>{this.props.title}</h3>
        <div className='workspace-option__description'>{this.props.description}</div>
        <Button
          className='workspace-option__button'
          onClick={this.props.onClick}
          label='Launch'
          buttonType='default'
          isPending={this.props.isPending}
          enabled={!this.props.isDisabled}
        />
      </div>
    );
  }
}

WorkspaceOption.propTypes = {
  icon: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  isPending: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool,
};

WorkspaceOption.defaultProps = {
  description: '',
  isDisabled: false,
};

export default WorkspaceOption;
