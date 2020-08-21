import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Space, Typography } from 'antd';
import { FileOutlined, FilePdfOutlined } from '@ant-design/icons';
import BackLink from '../components/BackLink';
import { humanFileSize } from '../utils.js';

import ReduxStudyDetails from './ReduxStudyDetails';
import './StudyViewer.css';
import { studyViewerConfig } from '../localconf';

const { Title } = Typography;

class SingleStudyViewer extends React.Component {
  render() {
    // some hacky way to load mock data in here
    // of course this will be replaced by passing in a prop or read from redux later
    const dataName = this.props.location.pathname.replace('/study-viewer/', '');
    const studyData = studyViewerConfig.data.find(element => element.name === dataName);

    return (
      <div className='study-viewer'>
        <BackLink url='/study-viewer' label='Back' />
        {(studyData) ?
          <Space className='study-viewer__space' direction='vertical'>
            <div className='study-viewer__title'>
              <Title level={4}>{studyData.title}</Title>
            </div>
            <div className='study-viewer__details'>
              <ReduxStudyDetails data={studyData} />
              <div className='study-viewer__details-sidebar'>
                <Space direction='vertical'>
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
                  {(studyData.document) ?
                    <div className='study-viewer__details-sidebar-box'>
                      <Space className='study-viewer__details-sidebar-space' direction='vertical'>
                        <div className='h3-typo'>Study Documents</div>
                        {studyData.document.map((doc) => {
                          const iconComponent = (doc.format === 'PDF') ? <FilePdfOutlined /> : <FileOutlined />;
                          const linkText = `${doc.name} (${doc.format} - ${humanFileSize(doc.size)})`;
                          const linkComponent = <a href={doc.link}>{linkText}</a>;
                          return (<div key={doc.name}>
                            {iconComponent}
                            {linkComponent}
                          </div>);
                        })}
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
  location: PropTypes.object.isRequired,
};

export default withRouter(SingleStudyViewer);
