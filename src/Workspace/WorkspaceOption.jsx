import React from 'react';
import PropTypes from 'prop-types';
import Button from '@gen3/ui-component/dist/components/Button';
import './WorkspaceOption.css';

class WorkspaceOption extends React.Component {
  render() {
    console.log(this.props.title, 'props', this.props);
    return (
      <div className='workspace-option'>
        <this.props.icon className='workspace-option__icon' />
        <h3 className='workspace-option__title'>{this.props.title}</h3>
        <div className='workspace-option__description'>{this.props.description}</div>
        <Button
          className='workspace-option__button'
          onClick={this.props.onClick}
          label='Launch'
          buttonType='default'
          isPending={this.props.isPending}
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
};

WorkspaceOption.defaultProps = {
  description: '',
};

export default WorkspaceOption;
