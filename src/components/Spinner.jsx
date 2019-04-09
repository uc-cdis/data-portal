import React from 'react';
import PropTypes from 'prop-types';
import './Spinner.less';

class Spinner extends React.Component {
  render() {
    return (
      <div className='spinner'>
        <svg className='spinner__svg' width='60' height='20' viewBox='0 0 60 20'>
          <circle cx='7' cy='15' r='4' />
          <circle cx='30' cy='15' r='4' />
          <circle cx='53' cy='15' r='4' />
        </svg>
        {this.props.text && <div className='spinner__text'> {this.props.text} </div>}
      </div>
    );
  }
}

Spinner.propTypes = {
  text: PropTypes.string,
};

Spinner.defaultProps = {
  text: '',
};

export default Spinner;
