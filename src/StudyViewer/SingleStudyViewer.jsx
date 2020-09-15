import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { withRouter } from 'react-router-dom';
import { Space, Typography, Spin, Result } from 'antd';
import { FileOutlined, FilePdfOutlined } from '@ant-design/icons';
import BackLink from '../components/BackLink';
import { humanFileSize } from '../utils.js';
import { ReduxStudyDetails, fetchDataset, fetchFiles, resetMultipleStudyData } from './reduxer';
import getReduxStore from '../reduxStore';
import './StudyViewer.css';

const { Title } = Typography;

class SingleStudyViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataType: undefined,
      rowAccessor: undefined,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const newState = {};
    if (nextProps.match.params.dataType
      && nextProps.match.params.dataType !== prevState.dataType) {
      newState.dataType = nextProps.match.params.dataType;
    }
    if (nextProps.match.params.rowAccessor
      && nextProps.match.params.rowAccessor !== prevState.rowAccessor) {
      newState.rowAccessor = nextProps.match.params.rowAccessor;
    }
    return Object.keys(newState).length ? newState : null;
  }

  render() {
    if (this.props.noConfigError) {
      this.props.history.push('/not-found');
    }
    if (!this.props.dataset) {
      if (this.state.dataType && this.state.rowAccessor) {
        getReduxStore().then(
          store =>
            Promise.all(
              [
                store.dispatch(fetchDataset(decodeURIComponent(this.state.dataType),
                  decodeURIComponent(this.state.rowAccessor))),
                store.dispatch(fetchFiles(decodeURIComponent(this.state.dataType), 'object', decodeURIComponent(this.state.rowAccessor))),
                store.dispatch(fetchFiles(decodeURIComponent(this.state.dataType), 'open-access', decodeURIComponent(this.state.rowAccessor))),
                store.dispatch(resetMultipleStudyData()),
              ],
            ));
      }
      return (
        <div className='study-viewer'>
          <div className='study-viewer_loading'>
            <Spin size='large' tip='Loading data...' />
          </div>
        </div>
      );
    }

    const dataset = this.props.dataset;
    const backURL = this.props.location.pathname.substring(0, this.props.location.pathname.lastIndexOf('/'));
    if (_.isEmpty(dataset)) {
      return (
        <div className='study-viewer'>
          <BackLink url={backURL} label='Back' />
          <Result
            title='No data available'
          />
        </div>
      );
    }
    return (
      <div className='study-viewer'>
        <BackLink url={backURL} label='Back' />
        <Space className='study-viewer__space' direction='vertical'>
          <div className='study-viewer__title'>
            <Title level={4}>{dataset.title}</Title>
          </div>
          <div className='study-viewer__details'>
            <ReduxStudyDetails data={dataset} fileData={this.props.fileData} />
            <div className='study-viewer__details-sidebar'>
              <Space direction='vertical' style={{ width: '100%' }}>
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
  dataset: PropTypes.object,
  docData: PropTypes.array,
  fileData: PropTypes.array,
  noConfigError: PropTypes.string,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
};

SingleStudyViewer.defaultProps = {
  dataset: undefined,
  docData: [],
  fileData: [],
  noConfigError: undefined,
};

export default withRouter(SingleStudyViewer);
