import React from 'react';
import PropTypes from 'prop-types';
import { Space, Spin } from 'antd';
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
    if (!this.props.dataset) {
      return (
        <div className='study-viewer'>
          <Spin size='large' tip='Loading data...' />
        </div>
      );
    }

    const dataset = this.props.dataset;
    if (dataset.length > 0
      && studyViewerConfig.openMode === 'open-first'
      && studyViewerConfig.defaultOpenStudyName !== '') {
      dataset.forEach((item, i) => {
        if (item.title === studyViewerConfig.defaultOpenStudyName) {
          dataset.splice(i, 1);
          dataset.unshift(item);
        }
      });
    }

    return (
      <div className='study-viewer'>
        <div className='h2-typo study-viewer__title'>
          {(studyViewerConfig.title) || 'Datasets' }
        </div>
        {(dataset.length > 0) ?
          <Space className='study-viewer__space' direction='vertical'>
            {(dataset.map((d, i) =>
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
  dataset: PropTypes.array,
};

StudyViewer.defaultProps = {
  dataset: [],
};

export default StudyViewer;
