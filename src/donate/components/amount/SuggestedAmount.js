import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Card } from 'react-bootstrap';

const SuggestedAmount = ({ data, isSelected, selectAmount, currency }) => {
  const label = `${currency.code} ${currency.symbol}${data.amount}`;

  return (
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
          <Card.Title className="mb-1">{label}</Card.Title>
          <Card.Text>{data.desc}</Card.Text>
        </Card.Body>
        </Col>
      </Row>
    </Card>
  );
};

const mapStateToProps = state => {
  return {
    currency: state.explain.currency,
  };
};

export default connect(mapStateToProps)(SuggestedAmount);
