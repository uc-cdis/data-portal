import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Button from '@gen3/ui-component/dist/components/Button';
import './Introduction.less';

class Introduction extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
  };

  render() {
    return (
      <div className='introduction'>
        <div className='h1-typo introduction__title'>{this.props.data.heading}</div>
        <div className='high-light introduction__text'>{this.props.data.text}</div>
        <div className='introduction__button-area'>
          <Button
            label={'View Clinical Trials'}
            buttonType='primary'
            onClick={() => this.props.history.push('/study-viewer')}
          />
          <Button
            label={'Login'}
            buttonType='primary'
            onClick={() => this.props.history.push('/login')}
          />
        </div>
      </div>
    );
  }
}

Introduction.propTypes = {
  history: PropTypes.object.isRequired,
};

export default withRouter(Introduction);
