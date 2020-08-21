import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import { Space, Typography, Descriptions, message, Divider, Alert } from 'antd';
import Button from '@gen3/ui-component/dist/components/Button';
import { FileOutlined, FilePdfOutlined, LinkOutlined } from '@ant-design/icons';
import { capitalizeFirstLetter, humanFileSize } from '../utils';
import './StudyViewer.css';

const { Paragraph } = Typography;

const onDownload = () => {
  message
    .loading('Downloading in progress..', 3)
    .then(() => message.success('Download has finished', 3));
};

const onRequestAccess = () => {
  window.open('https://niaiddevportal.dynamics365portals.us/data-use-request?request_id=123');
};

class StudyDetails extends React.Component {
  render() {
    const onNotLoggedInRequestAccess = () => this.props.history.push('/login', { from: this.props.location.pathname });
    const userHasLoggedIn = !!this.props.user.username;

    let requestAccessButtonFunc = onDownload;
    if (!userHasLoggedIn) {
      requestAccessButtonFunc = onNotLoggedInRequestAccess;
    } else if (!this.props.data.hasAccess) {
      requestAccessButtonFunc = onRequestAccess;
    }

    return (
      <div className='study-details'>
        <Space className='study-viewer__space' direction='vertical'>
          <Space>
            {(this.props.displayLearnMoreBtn) ?
              <Button
                label={'Learn More'}
                buttonType='primary'
                onClick={() => this.props.history.push(`/study-viewer/${this.props.data.name}`)}
              />
              : null}
            <Button
              label={(userHasLoggedIn && this.props.data.hasAccess) ? 'Download' : 'Request Access'}
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
          <div className='h3-typo'>Brief Study Description</div>
          <Paragraph>
            {this.props.data.description}
          </Paragraph>
          {(this.props.data.meta) ?
            <Descriptions
              className='study-details__descriptions'
              bordered
              column={1}
            >
              {(Object.entries(this.props.data.meta).map(([k, v]) => {
                let value = [];
                if (_.isArray(v)) {
                  value = v;
                } else {
                  value.push(v);
                }
                return (
                  <Descriptions.Item key={k} label={capitalizeFirstLetter(k)}>
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
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    meta: PropTypes.object,
    hasAccess: PropTypes.bool.isRequired,
  }).isRequired,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  displayLearnMoreBtn: PropTypes.bool,
};

StudyDetails.defaultProps = {
  displayLearnMoreBtn: false,
};

export default withRouter(StudyDetails);
