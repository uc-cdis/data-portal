import PropTypes from 'prop-types';
import React, { Component } from 'react';
import parse from 'html-react-parser';
import { withRouter } from 'react-router-dom';
import { Space } from 'antd';
import Button from '@gen3/ui-component/dist/components/Button';
import { studyViewerConfig } from '../localconf';
import './Introduction.less';

class Introduction extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
  };

  render() {
    const buttonURL = `/study-viewer/${studyViewerConfig[0].dataType}`;
    return (
      <div className='introduction'>
        <div className='h1-typo introduction__title'>{this.props.data.heading}</div>
        <div className='high-light introduction__text'>
          {(this.props.data.text) ? parse(this.props.data.text) : null}
          {(this.props.data.multiLineTexts) ?
            (this.props.data.multiLineTexts.map((text, i) => <p key={i}>{parse(text)}</p>)) : null}
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

Introduction.propTypes = {
  history: PropTypes.object.isRequired,
};

export default withRouter(Introduction);
