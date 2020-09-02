import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Space, Typography, Spin } from 'antd';
import { FileOutlined, FilePdfOutlined } from '@ant-design/icons';
import BackLink from '../components/BackLink';
import { humanFileSize } from '../utils.js';
import { ReduxStudyDetails, fetchDataset, fetchFiles } from './reduxer';
import getReduxStore from '../reduxStore';
import './StudyViewer.css';

const { Title } = Typography;

class SingleStudyViewer extends React.Component {
  componentDidMount() {
    getReduxStore().then(
      store =>
        Promise.all(
          [
            store.dispatch(fetchDataset(decodeURIComponent(this.props.match.params[0]))),
            store.dispatch(fetchFiles('object', decodeURIComponent(this.props.match.params[0]))),
            store.dispatch(fetchFiles('open-access', decodeURIComponent(this.props.match.params[0]))),
          ],
        ));
  }

  render() {
    if (!this.props.dataset || this.props.dataset.length === 0) {
      return (
        <div className='study-viewer'>
          <div className='study-viewer_loading'>
            <Spin size='large' tip='Loading data...' />
          </div>
        </div>
      );
    }
    const dataset = this.props.dataset[0];
    return (
      <div className='study-viewer'>
        <BackLink url='/study-viewer' label='Back' />
        <Space className='study-viewer__space' direction='vertical'>
          <div className='study-viewer__title'>
            <Title level={4}>{dataset.title}</Title>
          </div>
          <div className='study-viewer__details'>
            <ReduxStudyDetails data={dataset} fileData={this.props.fileData} />
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
                {(this.props.docData.length > 0) ?
                  <div className='study-viewer__details-sidebar-box'>
                    <Space className='study-viewer__details-sidebar-space' direction='vertical'>
                      <div className='h3-typo'>Study Documents</div>
                      {this.props.docData.map((doc) => {
                        const iconComponent = (doc.data_format === 'PDF') ? <FilePdfOutlined /> : <FileOutlined />;
                        const linkText = `${doc.file_name} (${doc.data_format} - ${humanFileSize(doc.file_size)})`;
                        const linkComponent = <a href={doc.doc_url}>{linkText}</a>;
                        return (<div key={doc.file_name}>
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
      </div>
    );
  }
}

SingleStudyViewer.propTypes = {
  dataset: PropTypes.array,
  docData: PropTypes.array,
  fileData: PropTypes.array,
  match: PropTypes.object.isRequired,
};

SingleStudyViewer.defaultProps = {
  dataset: [],
  docData: [],
  fileData: [],
};

export default withRouter(SingleStudyViewer);
