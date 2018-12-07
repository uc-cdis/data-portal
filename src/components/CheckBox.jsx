import React from 'react';
import PropTypes from 'prop-types';
import './CheckBox.less';

class CheckBox extends React.Component {
  onChange = () => {
    this.props.onChange(this.props.id);
  }

  render() {
    return (
      <div className='checkbox'>
        <input
          type='checkbox'
          id={this.props.id}
          value={this.props.item}
          checked={this.props.isSelected}
          onChange={this.onChange}
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
};

CheckBox.defaultProps = {
  item: {},
};

export default CheckBox;
