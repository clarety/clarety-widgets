import React from 'react';
import { connect } from 'react-redux';
import { Card } from 'react-bootstrap';

const _SuggestedAmountLg = ({ amountInfo, isSelected, onClick, onMouseEnter, currency, forceMd }) => {
  const label = `${currency.symbol}${amountInfo.amount}`;

  let cardClassName = 'mx-1 d-none';
  if (!forceMd) cardClassName += ' d-lg-block';

  return (
    <Card
      className={cardClassName}
      style={{ cursor: 'pointer' }}
      bg={isSelected ? 'info' : 'light'}
      text={isSelected ? 'white' : null}
      onClick={() => onClick(amountInfo.amount)}
      onMouseEnter={() => onMouseEnter(amountInfo)}
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
