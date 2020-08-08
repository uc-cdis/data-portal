import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Space, Typography, Descriptions, message } from 'antd';
import Button from '@gen3/ui-component/dist/components/Button';
import { capitalizeFirstLetter } from '../utils';
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
          <div className='h3-typo'>Study Description</div>
          <Paragraph>
            {this.props.data.description}
          </Paragraph>
          {(this.props.data.meta) ?
            <Descriptions
              className='study-details__descriptions'
              bordered
              column={1}
            >
              {(Object.entries(this.props.data.meta).map(([k, v]) =>
                <Descriptions.Item key={k} label={capitalizeFirstLetter(k)}>{v}</Descriptions.Item>,
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
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    meta: PropTypes.object,
    hasAccess: PropTypes.bool.isRequired,
  }).isRequired,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

export default withRouter(StudyDetails);
