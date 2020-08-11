import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Card, Collapse, Space } from 'antd';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import Button from '@gen3/ui-component/dist/components/Button';

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
          title={
            <Space>
              {this.props.data.title}
              <Button
                label={'Learn More'}
                buttonType='primary'
                onClick={() => this.props.history.push(`/study-viewer/${this.props.data.name}`)}
              />
            </Space>
          }
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
              <ReduxStudyDetails data={this.props.data} />
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
  history: PropTypes.object.isRequired,
  initialPanelExpandStatus: PropTypes.bool.isRequired,
};

export default withRouter(StudyCard);
