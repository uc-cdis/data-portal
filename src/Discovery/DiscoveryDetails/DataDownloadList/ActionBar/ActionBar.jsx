import React from 'react';
import { Col, Row, List, Button } from 'antd';

const ActionBar = () => {
    return (<>

    <Row className="row">
      <Col flex="1 0 auto" className="column Red">Red</Col>
      <Col flex="1 0 auto" className="column Green">Green</Col>
      <Col flex="1 0 auto" className="column Blue">Blue</Col>
      <Col flex="1 0 auto" className="column Blue">Yellow</Col>
    </Row>
    </>)
}
export default ActionBar;
