/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Space, Typography, Descriptions, message, Divider, Alert, Modal, List } from 'antd';
import Button from '@gen3/ui-component/dist/components/Button';
import {
  // for nested docs maybe
  // FileOutlined,
  // FilePdfOutlined,
  LinkOutlined } from '@ant-design/icons';
import { capitalizeFirstLetter, humanFileSize } from '../utils';
import { userHasMethodOnResource } from '../authMappingUtils';
import { useArboristUI, requestorPath, userapiPath } from '../localconf';
import { fetchWithCreds } from '../actions';
import './StudyViewer.css';

const { Paragraph } = Typography;

// small helper to check if a given string is a valid URL by using URL()
const stringIsAValidUrl = (s) => {
  try {
    // eslint-disable-next-line no-new
    new URL(s);
    return true;
  } catch (err) {
    return false;
  }
};

class StudyDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      downloadModalVisible: false,
      redirectModalVisible: false,
      redirectUrl: undefined,
    };
  }

  componentDidUpdate() {
    // check if user is not logged in by looking at the user props
    // note that we only need to redirect user to /login if the search param is `?request_access`
    // `?request_access` means user got here by clicking the `Request Access` button
    // and `?request_access_logged_in` means user got here by redirecting from the login page
    // in that case, don't redirect user again, just wait for user props to update
    if ((!this.props.user || !this.props.user.username)
    && this.props.location.search
    && this.props.location.search === '?request_access') {
      this.props.history.push('/login', { from: `${this.props.location.pathname}?request_access` });
    } else if (this.props.user
      && this.props.user.username
      && this.props.location.search
      && this.props.location.search.includes('?request_access')) {
      // if we still have either `?request_access` or `?request_access_logged_in`
      // it means we haven't finished check yet
      // next is to check if user has access to the resource
      if (!this.isDataAccessible(this.props.data.accessibleValidationValue)) {
        // if the user haven't have a request in `SUBMITTED` state for this resource yet
        if (!this.props.data.accessRequested) {
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
                message
                  .success('A request has been sent', 3);
                if (data && data.redirect_url) {
                  this.setState({
                    redirectUrl: data.redirect_url,
                    redirectModalVisible: true,
                  });
                }
              } else {
                message
                  .error(`Something went wrong when talking to Requestor service, status ${status}`, 3);
              }
            },
          );
        }
      }
      // we are done here, remove the query string from URL
      this.props.history.push(`${this.props.location.pathname}`, { from: this.props.location.pathname });
    }
  }

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

  handleRedirectModalCancel = () => {
    this.setState({
      redirectModalVisible: false,
      redirectUrl: undefined,
    });
  };

  handleRedirectModalOk = () => {
    if (this.state.redirectUrl) {
      window.open(this.state.redirectUrl);
    }
    this.setState({
      redirectModalVisible: false,
      redirectUrl: undefined,
    });
  };

  showDownloadModal = () => {
    this.setState({
      downloadModalVisible: true,
    });
  };

  handleDownloadModalCancel = () => {
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
     const onRequestAccess = () => this.props.history.push(`${this.props.location.pathname}?request_access`, { from: this.props.location.pathname });
     const userHasLoggedIn = !!this.props.user.username;

     const displayDownloadButton = userHasLoggedIn
     && this.isDataAccessible(this.props.data.accessibleValidationValue)
     && this.props.fileData.length > 0;
     const downloadButtonFunc = this.showDownloadModal;

     const displayRequestAccessButton = !userHasLoggedIn
     || !this.isDataAccessible(this.props.data.accessibleValidationValue);
     let requestAccessButtonText = userHasLoggedIn ? 'Request Access' : 'Login to Request Access';
     requestAccessButtonText = this.props.data.accessRequested ? 'Access Requested' : requestAccessButtonText;

     return (
       <div className='study-details'>
         <Space className='study-viewer__space' direction='vertical'>
           { (this.props.displayLearnMoreBtn
           || displayDownloadButton
           || displayRequestAccessButton) ?
             (<Space>
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
                   enabled={!this.props.data.accessRequested}
                   label={requestAccessButtonText}
                   buttonType='primary'
                   onClick={onRequestAccess}
                 /> : null}
             </Space>) : null
           }
           <Modal
             title='Redirection'
             visible={this.state.redirectModalVisible}
             closable={false}
             onCancel={this.handleRedirectModalCancel}
             footer={[
               <Button
                 key='modal-refuse-button'
                 label={'Refuse'}
                 buttonType='default'
                 onClick={this.handleRedirectModalCancel}
               />,
               <Button
                 key='modal-accept-button'
                 label={'Accept'}
                 buttonType='primary'
                 onClick={this.handleRedirectModalOk}
               />,
             ]}
           >
             <p>You will now be redirected to <a href={this.state.redirectUrl}>{this.state.redirectUrl}</a> for the next step.</p>
           </Modal>
           <Modal
             title='Download Files'
             visible={this.state.downloadModalVisible}
             closable={false}
             onCancel={this.handleDownloadModalCancel}
             footer={[
               <Button
                 key='modal-close-button'
                 label={'Close'}
                 buttonType='primary'
                 onClick={this.handleDownloadModalCancel}
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
           {(!userHasLoggedIn && !this.props.data.accessRequested) ?
             <Alert
               message='Please note that researchers are required to log in upon clicking the Request Access button and you will be prompted to login if you have not already done so.'
               type='info'
               showIcon
             /> : null}
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
                         if (stringIsAValidUrl(item)) {
                           return (<div key={item}>
                             <Space>
                               <LinkOutlined />
                               <a href={item}>
                                 {item}
                               </a>
                             </Space>
                           </div>);
                         }
                         return item;
                       }
                       // codes below are from the mockup, keeping them here since we might need then if we have the nested docs later
                       /*
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
                       */
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
    accessRequested: PropTypes.bool.isRequired,
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

export default StudyDetails;
