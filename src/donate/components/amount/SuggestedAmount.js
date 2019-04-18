import React from 'react';
import { connect } from 'react-redux';
import { Card } from 'react-bootstrap';

const SuggestedAmount = ({ amountInfo, isSelected, onClick, currency, forceMobileLayout }) => {
  const label = `${currency.code} ${currency.symbol}${amountInfo.amount}`;

  let cardClassName = 'mx-1 mb-2 d-none';
  if (!forceMobileLayout) cardClassName += ' mb-lg-0 d-lg-block';

  return (
    <Card
      className={cardClassName}
      style={{ cursor: 'pointer' }}
      bg={isSelected ? 'primary' : 'light'}
      text={isSelected ? 'white' : null}
      onClick={() => onClick(amountInfo.amount)}
      data-testid={`amount-${amountInfo.amount}`}
    >
      <Card.Img src={amountInfo.image} variant="top" />
      <Card.Body>
        <Card.Title className="mb-2">{label}</Card.Title>
        <Card.Text>{amountInfo.desc}</Card.Text>
      </Card.Body>
    </Card>
  );
};

const mapStateToProps = state => {
  return {
    currency: state.explain.currency,
  };
};

export default connect(mapStateToProps)(SuggestedAmount);
