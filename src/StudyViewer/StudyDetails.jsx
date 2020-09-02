import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import { Space, Typography, Descriptions, message, Divider, Alert } from 'antd';
import Button from '@gen3/ui-component/dist/components/Button';
import { FileOutlined, FilePdfOutlined, LinkOutlined } from '@ant-design/icons';
import { capitalizeFirstLetter, humanFileSize } from '../utils';
import { userHasMethodOnProject } from '../authMappingUtils';
import { studyViewerConfig, useArboristUI, requestorPath } from '../localconf';
import { fetchWithCreds } from '../actions';
import './StudyViewer.css';

const { Paragraph } = Typography;

const onDownload = () => {
  message
    .loading('Downloading in progress..', 3)
    .then(() => message.success('Download has finished', 3));
};

const getLabel = (label) => {
  if (!studyViewerConfig.fieldMapping || studyViewerConfig.fieldMapping.length === 0) {
    return capitalizeFirstLetter(label);
  }
  const fieldMappingEntry = studyViewerConfig.fieldMapping.find(i => i.field === label);
  if (fieldMappingEntry) {
    return fieldMappingEntry.name;
  }
  return capitalizeFirstLetter(label);
};

class StudyDetails extends React.Component {
  onRequestAccess = () => {
    const body = {
      username: this.props.user.username,
      resource_path: '/programs/TODO', // FIXME: fill this
      resource_id: this.props.data.rowAccessorValue,
      resource_display_name: this.props.data.title,
    };
    fetchWithCreds({
      path: `${requestorPath}request`,
      method: 'POST',
      body: JSON.stringify(body),
    }).then(
      ({ data }) => {
        if (data && data.redirect_url) {
          // if a redirect is configured, Requestor returns a redirect URL
          window.open(data.redirect_url);
        } else {
          message
            .error('Something went wrong when talking to Requestor service', 3);
        }
      },
    );
  };

   isDataAccessible = (accessibleValidationValue) => {
     if (!useArboristUI) {
       return true;
     }
     if (!accessibleValidationValue) {
       return false;
     }
     return (userHasMethodOnProject('read-storage', accessibleValidationValue, this.props.userAuthMapping)
   || userHasMethodOnProject('read', accessibleValidationValue, this.props.userAuthMapping));
   };

   render() {
     const onNotLoggedInRequestAccess = () => this.props.history.push('/login', { from: this.props.location.pathname });
     const userHasLoggedIn = !!this.props.user.username;

     let requestAccessButtonFunc = onDownload;
     if (!userHasLoggedIn) {
       requestAccessButtonFunc = onNotLoggedInRequestAccess;
     } else if (!this.isDataAccessible(this.props.data.accessibleValidationValue)) {
       requestAccessButtonFunc = this.onRequestAccess;
     }

     return (
       <div className='study-details'>
         <Space className='study-viewer__space' direction='vertical'>
           <Space>
             {(this.props.displayLearnMoreBtn) ?
               <Button
                 label={'Learn More'}
                 buttonType='primary'
                 onClick={() => this.props.history.push(`/study-viewer/${encodeURIComponent(this.props.data.rowAccessorValue)}`)}
               />
               : null}
             <Button
               label={(userHasLoggedIn
               && this.isDataAccessible(this.props.data.accessibleValidationValue)
               ) ? 'Download' : 'Request Access'}
               buttonType='primary'
               onClick={requestAccessButtonFunc}
               tooltipEnabled={!userHasLoggedIn}
               tooltipText={'Note that you will be prompted to log in'}
             />
           </Space>
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
                   <div className='h3-typo'>{getLabel(k)}</div>
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
                   <Descriptions.Item key={k} label={getLabel(k)}>
                     {value.map((item) => {
                       if (_.isString(item)) {
                         return item;
                       }
                       if (item.link) {
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
    fileData: PropTypes.array,
    docData: PropTypes.array,
  }).isRequired,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  displayLearnMoreBtn: PropTypes.bool,
  userAuthMapping: PropTypes.object.isRequired,
};

StudyDetails.defaultProps = {
  displayLearnMoreBtn: false,
};

export default withRouter(StudyDetails);
