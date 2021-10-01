import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'antd';
import { ReduxStudyDetails } from './reduxer';
import './StudyViewer.css';

class StudyCard extends React.Component {
  render() {
    return (
      <Card
        className='study-viewer__card'
      >
        <h3>{this.props.data.title}</h3>
        <ReduxStudyDetails
          data={this.props.data}
          fileData={this.props.fileData}
          studyViewerConfig={this.props.studyViewerConfig}
          isSingleItemView
        />
      </Card>
    );
  }
}

StudyCard.propTypes = {
  data: PropTypes.shape({
    accessRequested: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    rowAccessorValue: PropTypes.string.isRequired,
    blockData: PropTypes.object,
    tableData: PropTypes.object,
    accessibleValidationValue: PropTypes.string,
    fileData: PropTypes.array,
    docData: PropTypes.array,
  }).isRequired,
  fileData: PropTypes.array,
  studyViewerConfig: PropTypes.object,
};

StudyCard.defaultProps = {
  fileData: [],
  studyViewerConfig: {},
};

export default StudyCard;
