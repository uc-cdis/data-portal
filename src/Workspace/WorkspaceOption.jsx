import React from 'react';
import PropTypes from 'prop-types';
import Button from '../gen3-ui-component/components/Button';
import './WorkspaceOption.css';

function WorkspaceOption({
  icon,
  title,
  description,
  onClick,
  isPending,
  isDisabled,
}) {
  const Icon = icon;
  return (
    <div className='workspace-option'>
      <Icon className='workspace-option__icon' />
      <h3 className='workspace-option__title'>{title}</h3>
      <div className='workspace-option__description'>{description}</div>
      <Button
        className='workspace-option__button'
        onClick={onClick}
        label='Launch'
        buttonType='default'
        isPending={isPending}
        enabled={!isDisabled}
      />
    </div>
  );
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
