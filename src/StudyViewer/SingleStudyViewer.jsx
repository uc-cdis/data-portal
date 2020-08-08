import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Space, Typography } from 'antd';
import BackLink from '../components/BackLink';

import ReduxStudyDetails from './ReduxStudyDetails';
import './StudyViewer.css';
import { data } from './StudyViewer.jsx';

const { Title } = Typography;

class SingleStudyViewer extends React.Component {
  render() {
    // some hacky way to load mock data in here
    // of course this will be replaced by passing in a prop or read from redux later
    const dataUrl = this.props.location.pathname.replace('/study-viewer', '');
    const studyData = data.find(element => element.url === dataUrl);

    return (
      <div className='study-viewer'>
        <BackLink url='/study-viewer' label='Back' />
        {(studyData) ?
          <Space className='study-viewer__space' direction='vertical'>
            <div className='study-viewer__title'>
              <Title level={4}>{studyData.title}</Title>
            </div>
            <ReduxStudyDetails data={studyData} />
          </Space>
          : null}
      </div>
    );
  }
}

SingleStudyViewer.propTypes = {
  location: PropTypes.object.isRequired,
};

export default withRouter(SingleStudyViewer);
