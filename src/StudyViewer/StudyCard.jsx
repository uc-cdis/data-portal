import React from 'react';
import PropTypes from 'prop-types';
import { Card, Collapse } from 'antd';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { ReduxStudyDetails } from './reduxer';
import './StudyViewer.css';

const { Panel } = Collapse;

class StudyCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      panelExpanded: props.initialPanelExpandStatus,
    };
  }

    onCollapseChange = () => {
      this.setState((prevState) => ({
        panelExpanded: !prevState.panelExpanded,
      }));
    };

    render() {
      return (
        <Card
          className='study-viewer__card'
          title={this.props.data.title}
        >
          <Collapse
            defaultActiveKey={(this.state.panelExpanded) ? ['1'] : []}
            expandIcon={({ isActive }) => ((isActive)
              ? <MinusCircleOutlined /> : <PlusCircleOutlined />)}
            onChange={this.onCollapseChange}
            ghost
          >
            <Panel
              header={(this.state.panelExpanded) ? 'Hide details' : 'Show details'}
              key='1'
            >
              <ReduxStudyDetails
                data={this.props.data}
                fileData={this.props.fileData}
                studyViewerConfig={this.props.studyViewerConfig}
                isSingleItemView
                exportToWorkspaceAction={this.props.exportToWorkspaceAction}
                exportToWorkspaceEnabled={this.props.exportToWorkspaceEnabled}
              />
            </Panel>
          </Collapse>
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
  initialPanelExpandStatus: PropTypes.bool.isRequired,
  exportToWorkspaceAction: PropTypes.func,
  exportToWorkspaceEnabled: PropTypes.bool,
};

StudyCard.defaultProps = {
  fileData: [],
  studyViewerConfig: {},
  exportToWorkspaceAction: () => {},
  exportToWorkspaceEnabled: false,
};

export default StudyCard;
