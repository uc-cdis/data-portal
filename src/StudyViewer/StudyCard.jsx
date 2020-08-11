import React from 'react';
import PropTypes from 'prop-types';
import { Card, Collapse } from 'antd';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';

import ReduxStudyDetails from './ReduxStudyDetails';
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
      this.setState(prevState => ({
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
            expandIcon={({ isActive }) =>
              ((isActive) ? <MinusCircleOutlined /> : <PlusCircleOutlined />)}
            onChange={this.onCollapseChange}
            ghost
          >
            <Panel
              header={(this.state.panelExpanded) ? 'Hide details' : 'Show details'}
              key='1'
            >
              <ReduxStudyDetails data={this.props.data} displayLearnMoreBtn />
            </Panel>
          </Collapse>
        </Card>
      );
    }
}

StudyCard.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    meta: PropTypes.object,
    hasAccess: PropTypes.bool.isRequired,
  }).isRequired,
  initialPanelExpandStatus: PropTypes.bool.isRequired,
};

export default StudyCard;
