import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

export const ImageHeader = ({ image, title, subtitle }) => (
  <Container className="image-header">
    <Row>
      <Col xs="auto">
        <img src={image} />
      </Col>
      <Col className="image-header-title">
        <h2 className="title">{title}</h2>
        <p className="subtitle">{subtitle}</p>
      </Col>
    </Row>
  </Container>
);
