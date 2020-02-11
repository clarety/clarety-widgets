import React from 'react';
import { connect } from 'react-redux';
import { Card } from 'react-bootstrap';

const _SuggestedAmount = ({ amountInfo, isSelected, onClick, currency }) => {
  const label = `${currency.symbol}${amountInfo.amount}`;

  return (
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
        <Card.Title className="mb-2">{label}</Card.Title>
        <Card.Text>{amountInfo.description}</Card.Text>
      </Card.Body>
    </Card>
  );
};

const mapStateToProps = state => {
  return {
    currency: state.settings.currency,
  };
};

export const connectSuggestedAmount = connect(mapStateToProps);
export const SuggestedAmount = connectSuggestedAmount(_SuggestedAmount);
