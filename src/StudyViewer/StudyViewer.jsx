import React from 'react';
import PropTypes from 'prop-types';
import { Space, Spin } from 'antd';
import getReduxStore from '../reduxStore';
import { studyViewerConfig } from '../localconf';
import { fetchDataset, fetchFiles } from './reduxer';
import './StudyViewer.css';
import StudyCard from './StudyCard';

class StudyViewer extends React.Component {
  componentDidMount() {
    getReduxStore().then(
      store =>
        Promise.all(
          [
            store.dispatch(fetchDataset()),
            store.dispatch(fetchFiles('object')),
          ],
        ));
  }

  getPanelExpandStatus = (openMode, index) => {
    if (openMode === 'open-all') {
      return true;
    } else if (openMode === 'close-all') {
      return false;
    }
    return (index === 0);
  }

  render() {
    if (!this.props.datasets) {
      return (
        <div className='study-viewer'>
          <div className='study-viewer_loading'>
            <Spin size='large' tip='Loading data...' />
          </div>
        </div>
      );
    }

    const datasets = this.props.datasets;
    if (datasets.length > 0
      && studyViewerConfig.openMode === 'open-first'
      && studyViewerConfig.defaultOpenStudyName !== '') {
      datasets.forEach((item, i) => {
        if (item.title === studyViewerConfig.defaultOpenStudyName) {
          datasets.splice(i, 1);
          datasets.unshift(item);
        }
      });
    }

    return (
      <div className='study-viewer'>
        <div className='h2-typo study-viewer__title'>
          {(studyViewerConfig.title) || 'Datasets' }
        </div>
        {(datasets.length > 0) ?
          <Space className='study-viewer__space' direction='vertical'>
            {(datasets.map((d, i) =>
              (<StudyCard
                key={i}
                data={d}
                fileData={this.props.fileData
                  .filter(fd => fd.rowAccessorValue === d.rowAccessorValue)}
                initialPanelExpandStatus={this.getPanelExpandStatus(studyViewerConfig.openMode, i)}
              />)))}
          </Space>
          : null}
      </div>
    );
  }
}

StudyViewer.propTypes = {
  datasets: PropTypes.array,
  fileData: PropTypes.array,
};

StudyViewer.defaultProps = {
  datasets: [],
  fileData: [],
};

export default StudyViewer;
