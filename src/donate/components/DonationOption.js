import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';

const DonationOption = ({ data, isSelected, selectAmount }) => (
  <Card
    className="mt-2"
    style={{ cursor: 'pointer' }}
    bg={isSelected ? 'primary' : 'light'}
    text={isSelected ? 'white' : null}
    onClick={() => selectAmount(data.amount)}
  >
    <Row noGutters>
      <Col xs={4}>
        <Card.Img src={data.image} />
      </Col>
      <Col xs={8}>
      <Card.Body>
        <Card.Title className="mb-1">{data.label}</Card.Title>
        <Card.Text>{data.desc}</Card.Text>
      </Card.Body>
      </Col>
    </Row>
  </Card>
);

export default DonationOption;
