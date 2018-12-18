import React from 'react';
import PropTypes from 'prop-types';
import './CheckBox.less';

class CheckBox extends React.Component {
  onChange = () => {
    this.props.onChange(this.props.id);
  }

  render() {
    return (
      <div className={'checkbox '.concat(!this.props.isEnabled ? 'checkbox--disabled' : '')}>
        <input
          type='checkbox'
          id={this.props.id}
          value={this.props.item}
          checked={this.props.isSelected}
          onChange={this.onChange}
          title={this.props.isEnabled ? null : this.props.disabledText}
        />
      </div>
    );
  }
}

CheckBox.propTypes = {
  id: PropTypes.string.isRequired,
  item: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
  isEnabled: PropTypes.bool,
  disabledText: PropTypes.string,
};

CheckBox.defaultProps = {
  item: {},
  isEnabled: true,
  disabledText: null,
};

export default CheckBox;
