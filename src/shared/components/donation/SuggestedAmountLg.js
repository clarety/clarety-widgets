import React from 'react';
import { connect } from 'react-redux';
import { Card } from 'react-bootstrap';

const _SuggestedAmountLg = ({ amountInfo, isSelected, onClick, currency }) => {
  const label = `${currency.symbol}${amountInfo.amount}`;

  return (
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

export const SuggestedAmountLg = connect(mapStateToProps)(_SuggestedAmountLg);
