import React from 'react';
import PropTypes from 'prop-types';
import Button from '@gen3/ui-component/dist/components/Button';
import './WorkspaceOption.css';

class WorkspaceOption extends React.Component {
  render() {
    return (
      <div className='workspace-option'>
        <img src={this.props.icon} className='workspace-option__icon'/>
        <div className='workspace-option__title'>{this.props.title}</div>
        <div className='workspace-option__description'>{this.props.description}</div>
        <Button
          className='workspace-option__button'
          onClick={this.props.onClick}
          label='Launch'
          buttonType='default'
        />
      </div>
    );
  }
}

WorkspaceOption.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};

WorkspaceOption.defaultProps = {
  description: '',
};

export default WorkspaceOption;
