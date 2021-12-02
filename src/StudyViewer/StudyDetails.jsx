import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  Space, Typography, Descriptions, message, Divider, Alert, Modal, List,
} from 'antd';
import Button from '@gen3/ui-component/dist/components/Button';
import {
  // for nested docs maybe
  // FileOutlined,
  // FilePdfOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import { capitalizeFirstLetter, humanFileSize } from '../utils';
import { userHasMethodForServiceOnResource } from '../authMappingUtils';
import { useArboristUI, requestorPath, userAPIPath } from '../localconf';
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
    // track if there is at least 1 displayed request_access button:
    this.requestAccessButtonVisible = false;
    this.state = {
      accessRequested: props.data.accessRequested,
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
        // if the user has not requested access to this resource yet

        // this defaults to the config of the 1st configured request_access
        // button. if there are more than 1 with different configs, TODO fix
        const requestAccessConfig = this.props.studyViewerConfig.buttons && this.props.studyViewerConfig.buttons.find((e) => e.type === 'request_access');

        if (!this.state.accessRequested) {
          const body = {
            username: this.props.user.username,
            resource_path: this.props.data.accessibleValidationValue,
            resource_id: this.props.data.rowAccessorValue,
            resource_display_name: this.props.data[requestAccessConfig.resourceDisplayNameField],
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
                  this.setState({
                    redirectUrl: data.redirect_url,
                    redirectModalVisible: true,
                  });
                }
              } else if (status === 409) {
                // the request status was updated between the page
                // loading and the user clicking the button. assume
                // the user already requested access; disable button
                this.setState({ accessRequested: true });
              } else {
                message
                  .error(`Something went wrong while creating an access request (status: ${status}). Please try again later`, 5);
              }
            },
          );
        }
      }
      // we are done here, remove the query string from URL
      this.props.history.push(`${this.props.location.pathname}`, { from: this.props.location.pathname });
    }
  }

  getButton = (key, buttonConfig, userHasLoggedIn) => {
    // if this button is explicitly disabled in this view, return nothing
    if (this.props.isSingleItemView && buttonConfig.singleItemView === false) {
      return null;
    }
    if (!this.props.isSingleItemView && buttonConfig.listView === false) {
      return null;
    }

    let button;

    const enableButton = buttonConfig.enableButtonField
      && this.props.data.displayButtonsData[buttonConfig.enableButtonField]
      ? this.props.data.displayButtonsData[buttonConfig.enableButtonField] === 'true'
      : true;
    let tooltipEnabled = false;
    let tooltipText = '';
    if (!enableButton && buttonConfig.disableButtonTooltipText) {
      tooltipEnabled = true;
      tooltipText = buttonConfig.disableButtonTooltipText;
    }

    if (buttonConfig.type === 'download') {
      // 'Download' button
      const displayDownloadButton = userHasLoggedIn
      && this.isDataAccessible(this.props.data.accessibleValidationValue)
      && this.props.fileData.length > 0;

      button = displayDownloadButton ? (
        <Button
          key={key}
          label={'Download'}
          buttonType='primary'
          onClick={this.showDownloadModal}
          enabled={enableButton}
          tooltipEnabled={tooltipEnabled}
          tooltipText={tooltipText}
        />
      ) : null;
    } else if (buttonConfig.type === 'export-pfb-to-workspace') {
      // 'Export to Workspace' button
      const displayDownloadButton = userHasLoggedIn
      && this.isDataAccessible(this.props.data.accessibleValidationValue)
      && this.props.fileData.length > 0
      && this.props.userAccess.Workspace;

      const onClickProperties = { ...buttonConfig, accessibleValidationValue: this.props.data.accessibleValidationValue };

      button = displayDownloadButton ? (
        <Button
          key={key}
          label={'Export to Workspace'}
          buttonType='primary'
          onClick={() => this.props.exportToWorkspaceAction(onClickProperties)}
          enabled={this.props.exportToWorkspaceEnabled}
          tooltipEnabled={!this.props.exportToWorkspaceEnabled && !!buttonConfig.disableButtonTooltipText}
          tooltipText={buttonConfig.disableButtonTooltipText}
        />
      ) : null;
    } else if (buttonConfig.type === 'request_access') {
      // 'Request Access' and 'Login to Request Access' buttons
      const onRequestAccess = () => {
        this.props.history.push(`${this.props.location.pathname}?request_access`, { from: this.props.location.pathname });
      };
      let requestAccessText = userHasLoggedIn ? 'Request Access' : 'Login to Request Access';
      if (enableButton && this.state.accessRequested) {
        // the button is disabled because the user has already requested access
        requestAccessText = (buttonConfig.accessRequestedText) ? buttonConfig.accessRequestedText : 'Access Requested';
        if (buttonConfig.accessRequestedTooltipText) {
          tooltipEnabled = true;
          tooltipText = buttonConfig.accessRequestedTooltipText;
        }
      }
      const displayRequestAccessButton = !userHasLoggedIn
      || !this.isDataAccessible(this.props.data.accessibleValidationValue);
      this.requestAccessButtonVisible = displayRequestAccessButton;

      button = displayRequestAccessButton ? (
        <Button
          key={key}
          label={requestAccessText}
          buttonType='primary'
          onClick={onRequestAccess}
          enabled={enableButton && !this.state.accessRequested}
          tooltipEnabled={tooltipEnabled}
          tooltipText={tooltipText}
        />
      ) : null;
    } else {
      console.warn(`Study viewer button type '${buttonConfig.type}' unknown`); // eslint-disable-line no-console
    }

    return button;
  }

  getLabel = (label) => {
    if (!this.props.studyViewerConfig.fieldMapping
     || this.props.studyViewerConfig.fieldMapping.length === 0) {
      return capitalizeFirstLetter(label);
    }
    const fieldMappingEntry = this.props.studyViewerConfig.fieldMapping
      .find((i) => i.field === label);
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
     return (userHasMethodForServiceOnResource('read-storage', 'fence', accessibleValidationValue, this.props.userAuthMapping));
   };

   render() {
     const userHasLoggedIn = !!this.props.user.username;

     // this defaults to the config of the 1st configured request_access
     // button. if there are more than 1 with different configs, TODO fix
     const requestAccessConfig = this.props.studyViewerConfig.buttons && this.props.studyViewerConfig.buttons.find((e) => e.type === 'request_access');

     return (
       <div className='study-details'>
         <Space className='study-viewer__space' direction='vertical'>
           <Space>
             {this.props.isSingleItemView
               ? (
                 <Button
                   label={'Learn More'}
                   buttonType='primary'
                   onClick={() => this.props.history.push(`${this.props.location.pathname}/${encodeURIComponent(this.props.data.rowAccessorValue)}`)}
                 />
               )
               : null}
             {
               (this.props.studyViewerConfig.buttons) ? this.props.studyViewerConfig.buttons.map(
                 (buttonConfig, i) => this.getButton(i, buttonConfig, userHasLoggedIn),
               ) : null
             }
           </Space>
           {(requestAccessConfig) ? (
             <Modal
               title='Request Access'
               visible={this.state.redirectModalVisible}
               closable={false}
               onCancel={this.handleRedirectModalCancel}
               footer={[
                 <Button
                   key='modal-accept-button'
                   label={'Confirm'}
                   buttonType='primary'
                   onClick={this.handleRedirectModalOk}
                 />,
                 <Button
                   key='modal-refuse-button'
                   label={'Cancel'}
                   buttonType='default'
                   onClick={this.handleRedirectModalCancel}
                 />,
               ]}
             >
               <p>You will now be sent to <a href={this.state.redirectUrl}>{requestAccessConfig.redirectModalText || this.state.redirectUrl}</a>.</p>
             </Modal>
           ) : null}
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
                 const downloadLink = (item.object_id) ? `${userAPIPath}data/download/${item.object_id}?expires_in=900&redirect` : '';
                 return (
                   <List.Item
                     key={item.file_name}
                     actions={[<a key='modal-list-download-link' href={downloadLink}>download</a>]}
                   >
                     {`${item.file_name} (${item.data_format} - ${humanFileSize(item.file_size)})`}
                   </List.Item>
                 );
               }}
             />
           </Modal>
           {this.requestAccessButtonVisible && !userHasLoggedIn && !this.state.accessRequested
             ? (
               <Alert
                 message='Please note that researchers are required to log in before requesting access.'
                 type='info'
                 showIcon
               />
             ) : null}
           <Divider />
           {(this.props.data.blockData)
             ? (
               <div>
                 {(Object.entries(this.props.data.blockData).map(([k, v]) => (
                   <div key={k}>
                     <div className='h3-typo'>{this.getLabel(k)}</div>
                     <Paragraph>
                       {v}
                     </Paragraph>
                   </div>
                 )))}
               </div>
             ) : null }
           {(this.props.data.tableData)
             ? (
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
                             return (
                               <div key={item}>
                                 <Space>
                                   <LinkOutlined />
                                   <a href={item}>
                                     {item}
                                   </a>
                                 </Space>
                               </div>
                             );
                           }
                           return item;
                         }
                         if (!item) {
                           return null;
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
                         console.warn(`Unknown object found in meta data for key '${k}': ${item}`);
                         return null;
                       })}
                     </Descriptions.Item>
                   );
                 }))}
               </Descriptions>
             )
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
    displayButtonsData: PropTypes.object,
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
  isSingleItemView: PropTypes.bool.isRequired,
  userAuthMapping: PropTypes.object.isRequired,
  userAccess: PropTypes.object.isRequired,
  studyViewerConfig: PropTypes.object,
  exportToWorkspaceAction: PropTypes.func,
  exportToWorkspaceEnabled: PropTypes.bool,
};

StudyDetails.defaultProps = {
  fileData: [],
  studyViewerConfig: {},
  exportToWorkspaceAction: () => {},
  exportToWorkspaceEnabled: false,
};

export default StudyDetails;
