import React from 'react';
import { connect } from 'react-redux';
import { Card } from 'react-bootstrap';

const SuggestedAmount = ({ amountInfo, isSelected, onClick, currency, forceMobileLayout }) => {
  const label = `${currency.code} ${currency.symbol}${amountInfo.amount}`;

  let cardClassName = 'flex-row mx-1 mb-2';
  if (!forceMobileLayout) cardClassName += ' d-lg-none';

  return (
    <Card
      className={cardClassName}
      style={{ cursor: 'pointer' }}
      bg={isSelected ? 'primary' : 'light'}
      text={isSelected ? 'white' : null}
      onClick={() => onClick(amountInfo.amount)}
      data-testid={`amount-${amountInfo.amount}`}
    >
      <div style={{ width: '30%', background: `url(${amountInfo.image}) center center / cover`}}></div>
      <Card.Body style={{ width: '70%' }}>
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
