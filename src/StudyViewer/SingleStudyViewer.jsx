import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  Space, Typography, Spin, Result,
} from 'antd';
import { FileOutlined, FilePdfOutlined, LinkOutlined } from '@ant-design/icons';
import BackLink from '../components/BackLink';
import { humanFileSize } from '../utils.js';
import {
  ReduxStudyDetails, fetchDataset, fetchFiles, resetMultipleStudyData, fetchStudyViewerConfig, ReduxExportToWorkspace,
} from './reduxer';
import getReduxStore from '../reduxStore';
import './StudyViewer.css';

const { Title } = Typography;

const getSideBoxItem = (itemConfig) => {
  let itemIcon = <FileOutlined />;
  if (itemConfig.type) {
    switch (itemConfig.type.toLowerCase()) {
    case 'pdf':
      itemIcon = <FilePdfOutlined />;
      break;
    case 'link':
      itemIcon = <LinkOutlined />;
      break;
    default:
      break;
    }
  }
  return (
    <div>
      {itemIcon}
      <a href={itemConfig.link}>{itemConfig.name}</a>
    </div>
  );
};

class SingleStudyViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataType: undefined,
      rowAccessor: undefined,
      exportToWorkspace: {},
      exportingPFBToWorkspace: false,
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

  componentDidMount() {
    if (!this.props.dataset
      && this.state.dataType
      && this.state.rowAccessor) {
      getReduxStore().then(
        (store) => Promise.allSettled(
          [
            store.dispatch(fetchDataset(decodeURIComponent(this.state.dataType),
              decodeURIComponent(this.state.rowAccessor))),
            store.dispatch(fetchFiles(decodeURIComponent(this.state.dataType), 'object', decodeURIComponent(this.state.rowAccessor))),
            store.dispatch(fetchFiles(decodeURIComponent(this.state.dataType), 'open-access', decodeURIComponent(this.state.rowAccessor))),
            store.dispatch(resetMultipleStudyData()),
          ],
        ));
    }
  }

  exportToWorkspace = (buttonConfig) => {
    this.setState({
      exportToWorkspace: { ...buttonConfig },
    });
  };

  exportingPFBToWorkspaceStateChange = (stateChange) => {
    const tempStateChange = {
      exportingPFBToWorkspace: stateChange,
    };

    // if set to false clear exportToWorkspace
    if (!stateChange) {
      tempStateChange.exportToWorkspace = {};
    }

    this.setState(tempStateChange);
  };

  render() {
    if (this.props.noConfigError) {
      this.props.history.push('/not-found');
    }
    if (!this.props.dataset) {
      return (
        <div className='study-viewer'>
          <div className='study-viewer_loading'>
            <Spin size='large' tip='Loading data...' />
          </div>
        </div>
      );
    }

    const studyViewerConfig = fetchStudyViewerConfig(this.state.dataType);
    const { dataset } = this.props;
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
    const sideBoxesConfig = (studyViewerConfig
      && studyViewerConfig.singleItemConfig
      && studyViewerConfig.singleItemConfig.sideBoxes)
      ? studyViewerConfig.singleItemConfig.sideBoxes : null;
    return (
      <div className='study-viewer'>
        <BackLink url={backURL} label='Back' />
        <Space className='study-viewer__space' direction='vertical'>
          <div className='study-viewer__title'>
            <Title level={4}>{dataset.title}</Title>
          </div>
          <div className='study-viewer__details'>
            <ReduxStudyDetails
              data={dataset}
              fileData={this.props.fileData}
              studyViewerConfig={studyViewerConfig}
              isSingleItemView={false}
              exportToWorkspaceAction={this.exportToWorkspace}
              exportToWorkspaceEnabled={!this.state.exportingPFBToWorkspace}
            />
            <div className='study-viewer__details-sidebar'>
              <Space direction='vertical' style={{ width: '100%' }}>
                {(sideBoxesConfig && sideBoxesConfig.length > 0)
                  ? (sideBoxesConfig.map((sbConfigItem, sbConfigIndex) => (
                    <div className='study-viewer__details-sidebar-box' key={`side_box_item_${sbConfigIndex}`}>
                      <Space className='study-viewer__details-sidebar-space' direction='vertical'>
                        <div className='h3-typo'>{sbConfigItem.title}</div>
                        {(sbConfigItem.items)
                          ? (sbConfigItem.items.map((it, itIndex) => (
                            <div key={`side_box_item_${itIndex}`}>
                              {getSideBoxItem(it)}
                            </div>
                          )))
                          : null}
                      </Space>
                    </div>
                  )))
                  : null}
                {(this.props.docData.length > 0)
                  ? (
                    <div className='study-viewer__details-sidebar-box'>
                      <Space className='study-viewer__details-sidebar-space' direction='vertical'>
                        <div className='h3-typo'>Study Documents</div>
                        {this.props.docData.map((doc) => {
                          const iconComponent = (doc.data_format === 'PDF') ? <FilePdfOutlined /> : <FileOutlined />;
                          const linkText = `${doc.file_name} (${doc.data_format} - ${humanFileSize(doc.file_size)})`;
                          const linkComponent = <a href={doc.doc_url}>{linkText}</a>;
                          return (
                            <div key={doc.file_name}>
                              {iconComponent}
                              {linkComponent}
                            </div>
                          );
                        })}
                      </Space>
                    </div>
                  )
                  : null}
              </Space>
            </div>
          </div>
        </Space>
        <ReduxExportToWorkspace
          exportToWorkspaceAction={this.state.exportToWorkspace}
          exportingPFBToWorkspaceStateChange={this.exportingPFBToWorkspaceStateChange}
          exportingPFBToWorkspace={this.state.exportingPFBToWorkspace}
        />
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
  match: PropTypes.shape(
    {
      params: PropTypes.object,
      path: PropTypes.string,
    },
  ).isRequired,
};

SingleStudyViewer.defaultProps = {
  dataset: undefined,
  docData: [],
  fileData: [],
  noConfigError: undefined,
};

export default SingleStudyViewer;
