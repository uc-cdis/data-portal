import React from 'react';
import { Col, Row, Button } from 'antd';
import './ActionBar.css';

const ActionBar = () => {
  return (
    <div className='discovery-modal_action-bar'>
      <Row className='row'>
        <Col flex='1 0 auto'>
          <Button className='discovery-action-bar-button'>
            Download <br />
            Variable-Level Metadata
          </Button>
        </Col>
        <Col flex='1 0 auto'>
          <Button className='discovery-action-bar-button'>
            Download <br />
            Study-Level Metadata
          </Button>
        </Col>
        <Col flex='1 0 auto'>
          <Button className='discovery-action-bar-button'>
            Download File Manifest
          </Button>
        </Col>
        <Col flex='1 0 auto'>
          <Button className='discovery-action-bar-button'>
            Download All Files
          </Button>
        </Col>
      </Row>
    </div>
  );
};
export default ActionBar;
