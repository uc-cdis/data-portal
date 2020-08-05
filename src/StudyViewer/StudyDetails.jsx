import React from 'react';
import PropTypes from 'prop-types';
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
    return (
      <div className='study-details'>
        <Space className='study-viewer__space' direction='vertical'>
          <Button
            label={(this.props.data.hasAccess) ? 'Download' : 'Request Access'}
            buttonType='primary'
            onClick={(this.props.data.hasAccess) ? onDownload : onRequestAccess}
          />
          <div className='h3-typo'>Study Description</div>
          <Paragraph>
            {this.props.data.description}
          </Paragraph>
          {(this.props.data.meta) ?
            <Descriptions
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
    meta: PropTypes.object,
    hasAccess: PropTypes.bool.isRequired,
  }).isRequired,
};

export default StudyDetails;
