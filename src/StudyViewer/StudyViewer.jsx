import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Space } from 'antd';
import Button from '@gen3/ui-component/dist/components/Button';
import { studyViewerConfig } from '../localconf';

import './StudyViewer.css';
import StudyCard from './StudyCard';

class StudyViewer extends React.Component {
  getPanelExpandStatus = (openMode, index) => {
    if (openMode === 'open-all') {
      return true;
    } else if (openMode === 'close-all') {
      return false;
    }
    return (index === 0);
  }

  render() {
    const onRedirectToLoginClicked = () => this.props.history.push('/login', { from: this.props.location.pathname });
    const userHasLoggedIn = !!this.props.user.username;

    if (studyViewerConfig.data
      && studyViewerConfig.data.length > 0
      && studyViewerConfig.openMode === 'open-first'
      && studyViewerConfig.defaultOpenStudyName !== '') {
      studyViewerConfig.data.forEach((item, i) => {
        if (item.name === studyViewerConfig.defaultOpenStudyName) {
          studyViewerConfig.data.splice(i, 1);
          studyViewerConfig.data.unshift(item);
        }
      });
    }

    return (
      <div className='study-viewer'>
        <div className='h2-typo study-viewer__title'>
              Studies
        </div>
        {(!userHasLoggedIn) ?
          <div className='study-viewer__login-banner'>
            <Space>
              <Button
                label={'Login'}
                buttonType='primary'
                onClick={onRedirectToLoginClicked}
              />
              <div className='h3-typo'>to see approved trials or requested trials</div>
            </Space>
          </div>
          : null}
        {(studyViewerConfig.data && studyViewerConfig.data.length > 0) ?
          <Space className='study-viewer__space' direction='vertical'>
            {(studyViewerConfig.data.map((d, i) =>
              (<StudyCard
                key={i}
                data={d}
                initialPanelExpandStatus={this.getPanelExpandStatus(studyViewerConfig.openMode, i)}
              />)))}
          </Space>
          : null}
      </div>
    );
  }
}

StudyViewer.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

export default withRouter(StudyViewer);
