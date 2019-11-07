import React from 'react';
import { Row, Col } from 'react-bootstrap';

export const ImageHeader = ({ image, title, subtitle }) => (
  <Row className="image-header">
    <Col xs="auto">
      <img src={image} />
    </Col>
    <Col className="image-header-title">
      <h2>{title}</h2>
      <h4>{subtitle}</h4>
    </Col>
  </Row>
);
