import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Quiz from './Quiz';
import './CertPopup.less';

/**
 * Little quiz component - roperites: questionList, title, onSubmit
 */
class CertPopup extends Component {
  static propTypes = {
    certsList: PropTypes.objectOf(
      PropTypes.any,
    ),
    pendingCerts: PropTypes.arrayOf(PropTypes.string),
    onSubmit: PropTypes.func.isRequired,
  };

  static defaultProps = {
    pendingCerts: [],
    certsList: {},
  };

  render() {
    const { certsList, pendingCerts } = this.props;
    if (pendingCerts.length > 0) {
      const firstPending = pendingCerts[0];
      return (
        <div className='cert_popup__mask'>
          <Quiz
            title={certsList[firstPending].title}
            description={certsList[firstPending].description}
            questionList={certsList[firstPending].questions}
            onSubmit={(data, questionList) => this.props.onSubmit(data, questionList, firstPending)}
          />
        </div>
      );
    }
    return null;
  }
}

export default CertPopup;
