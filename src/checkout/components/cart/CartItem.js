import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { Currency } from 'shared/components';

export const CartItem = ({ item }) => (
  <Row className="cart-item">
    <Col xs="auto" className="col-img">
      {item.image && <img src={item.image} width="50" height="50" />}
    </Col>

    <Col>
      <p className="cart-item__description">
        {item.description}
        {item.rewardDescription &&
          <span className="cart-item__reward">
            <br />Includes: {item.rewardDescription}
          </span>
        }
      </p>
      

      {!item.variablePrice &&
        <Row>
          <Col className="label">Quantity</Col>
          <Col className="text-right">{item.quantity}</Col>
        </Row>
      }

      <Row>
        <Col className="label">Amount</Col>
        <Col className="text-right">
          <Currency amount={item.total} />
        </Col>
      </Row>

      {item.variantDetails && item.variantDetails.map((detail, index) => 
        <Row key={index}>
          <Col className="label">{detail.label}</Col>
          <Col className="text-right">{detail.value}</Col>
        </Row>
      )}      
    </Col>
  </Row>
);
