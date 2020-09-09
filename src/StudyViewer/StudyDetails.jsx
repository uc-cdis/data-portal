import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import { Space, Typography, Descriptions, message, Divider, Alert, Modal, List } from 'antd';
import Button from '@gen3/ui-component/dist/components/Button';
import { FileOutlined, FilePdfOutlined, LinkOutlined } from '@ant-design/icons';
import { capitalizeFirstLetter, humanFileSize } from '../utils';
import { userHasMethodOnResource } from '../authMappingUtils';
import { useArboristUI, requestorPath, userapiPath } from '../localconf';
import { fetchWithCreds } from '../actions';
import './StudyViewer.css';

const { Paragraph } = Typography;

class StudyDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      downloadModalVisible: false,
    };
  }

  onRequestAccess = () => {
    const body = {
      username: this.props.user.username,
      resource_path: this.props.data.accessibleValidationValue,
      resource_id: this.props.data.rowAccessorValue,
      resource_display_name: this.props.data.title,
    };
    fetchWithCreds({
      path: `${requestorPath}request`,
      method: 'POST',
      body: JSON.stringify(body),
    }).then(
      ({ data, status }) => {
        if (status === 201) {
          // if a redirect is configured, Requestor returns a redirect URL
          if (data && data.redirect_url) {
            window.open(data.redirect_url);
          }
        } else {
          message
            .error(`Something went wrong when talking to Requestor service, status ${status}`, 3);
        }
      },
    );
  };

  getLabel = (label) => {
    if (!this.props.studyViewerConfig.fieldMapping
     || this.props.studyViewerConfig.fieldMapping.length === 0) {
      return capitalizeFirstLetter(label);
    }
    const fieldMappingEntry = this.props.studyViewerConfig.fieldMapping
      .find(i => i.field === label);
    if (fieldMappingEntry) {
      return fieldMappingEntry.name;
    }
    return capitalizeFirstLetter(label);
  };

  showDownloadModal = () => {
    this.setState({
      downloadModalVisible: true,
    });
  };

  handleOk = () => {
    this.setState({
      downloadModalVisible: false,
    });
  };

  handleCancel = () => {
    this.setState({
      downloadModalVisible: false,
    });
  };

   isDataAccessible = (accessibleValidationValue) => {
     if (!useArboristUI) {
       return true;
     }
     if (!accessibleValidationValue) {
       return false;
     }
     return (userHasMethodOnResource('read-storage', accessibleValidationValue, this.props.userAuthMapping));
   };

   render() {
     const onNotLoggedInRequestAccess = () => this.props.history.push('/login', { from: this.props.location.pathname });
     const userHasLoggedIn = !!this.props.user.username;

     const displayDownloadButton = userHasLoggedIn
     && this.isDataAccessible(this.props.data.accessibleValidationValue)
     && this.props.fileData.length > 0;
     const downloadButtonFunc = this.showDownloadModal;

     const displayRequestAccessButton = !userHasLoggedIn
     || !this.isDataAccessible(this.props.data.accessibleValidationValue);
     let requestAccessButton;
     if (!userHasLoggedIn) {
       requestAccessButton = onNotLoggedInRequestAccess;
     } else if (!this.isDataAccessible(this.props.data.accessibleValidationValue)) {
       requestAccessButton = this.onRequestAccess;
     }

     return (
       <div className='study-details'>
         <Space className='study-viewer__space' direction='vertical'>
           <Space>
             {(this.props.displayLearnMoreBtn) ?
               <Button
                 label={'Learn More'}
                 buttonType='primary'
                 onClick={() => this.props.history.push(`${this.props.location.pathname}/${encodeURIComponent(this.props.data.rowAccessorValue)}`)}
               />
               : null}
             {(displayDownloadButton) ?
               <Button
                 label={'Download'}
                 buttonType='primary'
                 onClick={downloadButtonFunc}
               /> : null}
             {(displayRequestAccessButton) ?
               <Button
                 label={'Request Access'}
                 buttonType='primary'
                 onClick={requestAccessButton}
                 tooltipEnabled={!userHasLoggedIn}
                 tooltipText={'Note that you will be prompted to log in'}
               /> : null}
           </Space>
           <Modal
             title='Download Files'
             visible={this.state.downloadModalVisible}
             closable={false}
             onCancel={this.handleCancel}
             footer={[
               <Button
                 key='modal-close-button'
                 label={'Close'}
                 buttonType='primary'
                 onClick={this.handleCancel}
               />,
             ]}
           >
             <List
               size='small'
               bordered
               dataSource={this.props.fileData}
               renderItem={(item) => {
                 const downloadLink = (item.object_id) ? `${userapiPath}data/download/${item.object_id}?expires_in=900&redirect` : '';
                 return (<List.Item
                   key={item.file_name}
                   actions={[<a key='modal-list-download-link' href={downloadLink}>download</a>]}
                 >
                   {`${item.file_name} (${item.data_format} - ${humanFileSize(item.file_size)})`}
                 </List.Item>);
               }}
             />
           </Modal>
           <Alert
             message='Please note that researchers are required to log in upon clicking the Request Access button and you will be prompted to login if you have not already done so.'
             type='info'
             showIcon
           />
           <Divider />
           {(this.props.data.blockData) ?
             <div>
               {(Object.entries(this.props.data.blockData).map(([k, v]) => (
                 <div key={k}>
                   <div className='h3-typo'>{this.getLabel(k)}</div>
                   <Paragraph>
                     {v}
                   </Paragraph>
                 </div>)))}
             </div> : null }
           {(this.props.data.tableData) ?
             <Descriptions
               className='study-details__descriptions'
               bordered
               column={1}
             >
               {(Object.entries(this.props.data.tableData).map(([k, v]) => {
                 let value = [];
                 if (_.isArray(v)) {
                   value = v;
                 } else {
                   value.push(v);
                 }
                 return (
                   <Descriptions.Item key={k} label={this.getLabel(k)}>
                     {value.map((item) => {
                       if (_.isString(item)) {
                         return item;
                       }
                       if (item && item.link) {
                         let iconComponent = <LinkOutlined />;
                         let linkComponent = (<a href={item.link}>
                           {(item.name) ? item.name : item.link}
                         </a>);
                         if (item.type && item.type === 'file') {
                           iconComponent = (item.format === 'PDF') ? <FilePdfOutlined /> : <FileOutlined />;
                           const linkText = `${item.name} (${item.format} - ${humanFileSize(item.size)})`;
                           linkComponent = <a href={item.link}>{linkText}</a>;
                         }
                         return (<div key={item.name}>
                           {iconComponent}
                           {linkComponent}
                         </div>);
                       }
                       // eslint-disable-next-line no-console
                       console.warn('Unknown object found in meta data: ', item);
                       return null;
                     })}
                   </Descriptions.Item>);
               }))}
             </Descriptions>
             : null}
         </Space>
       </div>
     );
   }
}

StudyDetails.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    rowAccessorValue: PropTypes.string.isRequired,
    blockData: PropTypes.object,
    tableData: PropTypes.object,
    accessibleValidationValue: PropTypes.string,
  }).isRequired,
  fileData: PropTypes.arrayOf(
    PropTypes.shape({
      object_id: PropTypes.string.isRequired,
      file_name: PropTypes.string.isRequired,
      file_size: PropTypes.number,
      data_format: PropTypes.string,
    })),
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  displayLearnMoreBtn: PropTypes.bool,
  userAuthMapping: PropTypes.object.isRequired,
  studyViewerConfig: PropTypes.object,
};

StudyDetails.defaultProps = {
  displayLearnMoreBtn: false,
  fileData: [],
  studyViewerConfig: {},
};

export default withRouter(StudyDetails);
