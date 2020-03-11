import React from 'react';
import { connect } from 'react-redux';
import { Card } from 'react-bootstrap';

const _SuggestedAmount = ({ amountInfo, isSelected, onClick, currency, onMouseEnter, onMouseLeave }) => {
  const label = `${currency.symbol}${amountInfo.amount}`;

  return (
    <Card
      className="flex-row mx-1 mb-2"
      style={{ cursor: 'pointer' }}
      bg={isSelected ? 'info' : 'light'}
      text={isSelected ? 'white' : null}
      onClick={() => onClick(amountInfo.amount)}
      onMouseEnter={() => onMouseEnter(amountInfo)}
      onMouseLeave={() => onMouseLeave(amountInfo)}
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
