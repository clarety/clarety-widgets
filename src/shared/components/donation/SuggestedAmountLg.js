import React from 'react';
import { connect } from 'react-redux';
import { Card } from 'react-bootstrap';
import { Currency } from 'shared/components';

export const SuggestedAmountLg = ({ amountInfo, isSelected, onClick }) => (
  <Card
    className="mx-1 d-none d-lg-block"
    style={{ cursor: 'pointer' }}
    bg={isSelected ? 'primary' : 'light'}
    text={isSelected ? 'white' : null}
    onClick={() => onClick(amountInfo.amount)}
    data-testid={`amount-${amountInfo.amount}`}
  >
    <Card.Img src={amountInfo.image} variant="top" />
    <Card.Body>
      <Card.Title className="mb-2"><Currency amount={amountInfo.amount} /></Card.Title>
      <Card.Text>{amountInfo.description}</Card.Text>
    </Card.Body>
  </Card>
);
