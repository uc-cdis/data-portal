import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Space, Typography, Spin } from 'antd';
import { FileOutlined, FilePdfOutlined } from '@ant-design/icons';
import BackLink from '../components/BackLink';
import { humanFileSize } from '../utils.js';

import { ReduxStudyDetails } from './reduxer';
import './StudyViewer.css';
import { studyViewerConfig } from '../localconf';

const { Title } = Typography;

class SingleStudyViewer extends React.Component {
  render() {
    if (!this.props.dataset) {
      return (
        <div className='study-viewer'>
          <Spin size='large' tip='Loading data...' />
        </div>
      );
    }
    const dataset = this.props.dataset[0];
    return (
      <div className='study-viewer'>
        <BackLink url='/study-viewer' label='Back' />
        {(this.props.dataset && this.props.dataset.length > 0) ?
          <Space className='study-viewer__space' direction='vertical'>
            <div className='study-viewer__title'>
              <Title level={4}>{(dataset.briefTitle) ? `${dataset.title} (${dataset.briefTitle})` : dataset.title}</Title>
            </div>
            <div className='study-viewer__details'>
              <ReduxStudyDetails data={dataset} />
              <div className='study-viewer__details-sidebar'>
                <Space direction='vertical' style={{ width: '100%' }}>
                  <div className='study-viewer__details-sidebar-box'>
                    <Space className='study-viewer__details-sidebar-space' direction='vertical'>
                      <div className='h3-typo'>Data Access Agreements</div>
                      <div>
                        <FilePdfOutlined />
                        <a href=''>Data Use Agreement (DUA)</a>
                      </div>
                      <div>
                        <FilePdfOutlined />
                        <a href=''>Data Access Request (DAR)</a>
                      </div>
                    </Space>
                  </div>
                  {(dataset.fileData) ?
                    <div className='study-viewer__details-sidebar-box'>
                      <Space className='study-viewer__details-sidebar-space' direction='vertical'>
                        <div className='h3-typo'>Study Documents</div>
                        {/* {dataset.fileData.map((doc) => {
                          const iconComponent = (doc.format === 'PDF') ? <FilePdfOutlined /> : <FileOutlined />;
                          const linkText = `${doc.name} (${doc.format} - ${humanFileSize(doc.size)})`;
                          const linkComponent = <a href={doc.link}>{linkText}</a>;
                          return (<div key={doc.name}>
                            {iconComponent}
                            {linkComponent}
                          </div>);
                        })} */}
                      </Space>
                    </div>
                    : null
                  }
                </Space>
              </div>
            </div>
          </Space>
          : null}
      </div>
    );
  }
}

SingleStudyViewer.propTypes = {
  dataset: PropTypes.array,
};

SingleStudyViewer.defaultProps = {
  dataset: [],
};

export default withRouter(SingleStudyViewer);
