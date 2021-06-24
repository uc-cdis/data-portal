import PropTypes from 'prop-types';
import React, { Component } from 'react';
import parse from 'html-react-parser';
import { withRouter } from 'react-router-dom';
import { Space } from 'antd';
import Button from '@gen3/ui-component/dist/components/Button';
import { studyViewerConfig } from '../localconf';
import './Introduction.less';

class IntroductionNIAID extends Component {
  render() {
    const buttonURL = `/study-viewer/${studyViewerConfig && studyViewerConfig[0] && studyViewerConfig[0].dataType}`;
    return (
      <div className='introduction'>
        <h1>
          <div className='h1-typo introduction__title'>
            {this.props.data.heading}
          </div>
        </h1>
        <div className='high-light introduction__text'>
          {(this.props.data.text) ? parse(this.props.data.text) : null}
          {(this.props.data.multiLineTexts)
            ? (this.props.data.multiLineTexts
              .map((text, i) => <p key={i}>{parse(text)}</p>)) : null}
        </div>
        <div className='introduction__button-area'>
          <Space>
            <Button
              label={'View Clinical Trials'}
              buttonType='primary'
              onClick={() => this.props.history.push(buttonURL)}
            />
          </Space>
        </div>
      </div>
    );
  }
}

IntroductionNIAID.propTypes = {
  data: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(IntroductionNIAID);
