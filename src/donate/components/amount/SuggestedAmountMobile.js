import React from 'react';
import { connect } from 'react-redux';
import { Card, Image } from 'react-bootstrap';

const SuggestedAmountMobile = ({ amountInfo, isSelected, onClick, currency, forceMobileLayout }) => {
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
      <Image src={amountInfo.image} />
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

export default connect(mapStateToProps)(SuggestedAmountMobile);
