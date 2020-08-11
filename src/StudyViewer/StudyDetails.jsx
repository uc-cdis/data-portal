import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Space, Typography, Descriptions, message } from 'antd';
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
  message.info('Access requested', 3);
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
          <Button
            label={(userHasLoggedIn && this.props.data.hasAccess) ? 'Download' : 'Request Access'}
            buttonType='primary'
            onClick={requestAccessButtonFunc}
          />
          <div className='h3-typo'>Short Study Description</div>
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
                if (k === 'website') {
                  return (
                    <Descriptions.Item key={k} label={capitalizeFirstLetter(k)}>
                      <a href={v.link}>{(v.text) ? v.text : v.link}</a>
                    </Descriptions.Item>);
                }
                if (k === 'study_publications') {
                  return (
                    <Descriptions.Item key={k} label={capitalizeFirstLetter(k)}>
                      {v.map((pub) => {
                        if (pub.type === 'file') {
                          const iconComponent = (pub.format === 'PDF') ? <FilePdfOutlined /> : <FileOutlined />;
                          const linkText = `${pub.name} (${pub.format} - ${humanFileSize(pub.size)})`;
                          const linkComponent = <a href={pub.link}>{linkText}</a>;
                          return (<div key={pub.name}>
                            {iconComponent}
                            {linkComponent}
                          </div>);
                        } else if (pub.type === 'link') {
                          return (<div key={pub.name}>
                            <LinkOutlined />
                            <a key={pub.name} href={pub.link}>{pub.name}</a>
                          </div>);
                        }
                        return null;
                      })}
                    </Descriptions.Item>);
                }
                return (
                  <Descriptions.Item key={k} label={capitalizeFirstLetter(k)}>
                    {v}
                  </Descriptions.Item>);
              },
              ))}
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
};

export default withRouter(StudyDetails);
