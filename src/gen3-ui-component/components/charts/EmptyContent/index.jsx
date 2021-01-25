import React from 'react';
import PropTypes from 'prop-types';
import './EmptyContent.css';

class EmptyContent extends React.Component {
  render() {
    return (
      <div className='empty-content__div'>
        <i className='g3-icon g3-icon--not-apply' />
        <p>{this.props.message}</p>
      </div>
    );
  }
}

EmptyContent.propTypes = {
  message: PropTypes.string,
};

EmptyContent.defaultProps = {
  message: 'Cannot render this chart because some fields don\'t apply',
};

export default EmptyContent;
