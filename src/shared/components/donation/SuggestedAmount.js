import React from 'react';
import { connect } from 'react-redux';
import { Card } from 'react-bootstrap';
import { Currency } from 'shared/components';

export const SuggestedAmount = ({ amountInfo, isSelected, onClick }) => (
  <Card
    className="flex-row mx-1 mb-2 d-lg-none"
    style={{ cursor: 'pointer' }}
    bg={isSelected ? 'primary' : 'light'}
    text={isSelected ? 'white' : null}
    onClick={() => onClick(amountInfo.amount)}
    data-testid={`amount-${amountInfo.amount}`}
  >
    <div style={{ width: '30%', background: `url(${amountInfo.image}) center center / cover`}}></div>
    <Card.Body style={{ width: '70%' }}>
      <Card.Title className="mb-2"><Currency amount={amountInfo.amount} /></Card.Title>
      <Card.Text>{amountInfo.description}</Card.Text>
    </Card.Body>
  </Card>
);
