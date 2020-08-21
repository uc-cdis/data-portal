import React from 'react';
import { Space } from 'antd';
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

export default StudyViewer;
