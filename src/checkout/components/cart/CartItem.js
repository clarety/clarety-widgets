import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { currency } from 'shared/utils';

export const CartItem = ({ item }) => (
  <Row className="cart-item">
    <Col xs="auto">
      <img src={item.image} width="50" height="50" />
    </Col>

    <Col>
      <span className="cart-item-title">{item.description}</span>

      <Row as="dl">
        <dt className="col">Amount</dt>
        <dd className="col text-right">{currency(item.total)}</dd>
      </Row>

      {item.details.map((detail, index) => 
        <Row as="dl" key={index}>
          <dt className="col">{detail.label}</dt>
          <dd className="col text-right">{detail.value}</dd>
        </Row>
      )}

      <Row as="dl">
        <dt className="col">Quantity</dt>
        <dd className="col text-right">{item.quantity}</dd>
      </Row>
    </Col>
  </Row>
);
