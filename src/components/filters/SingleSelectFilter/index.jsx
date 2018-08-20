import React from 'react';
import PropTypes from 'prop-types';
import './SingleSelectFilter.less';

class SingleSelectFilter extends React.Component {
  render() {
    return (
      <div className='single-select-filter'>
        <input
          className='single-select-filter__checkbox'
          type='checkbox'
          onClick={this.props.onSelect}
        />
        <p>{this.props.label}</p>
      </div>
    );
  }
}

SingleSelectFilter.propTypes = {
  label: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default SingleSelectFilter;
