import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';

const PriceHandle = ({ data, isSelected, onClick }) => (
  <Card
    onClick={onClick}
    style={{ marginTop: '10px', cursor: 'pointer' }}
    bg={isSelected ? 'primary' : null}
    text={isSelected ? 'white' : null}
  >
    <Row noGutters>
      <Col xs={4}>
        <Card.Img src={data.image} />
      </Col>
      <Col xs={8}>
      <Card.Body>
        <Card.Title>{data.price}</Card.Title>
        <Card.Text>{data.desc}</Card.Text>
        
      </Card.Body>
      </Col>
    </Row>
  </Card>
);

export default PriceHandle;
