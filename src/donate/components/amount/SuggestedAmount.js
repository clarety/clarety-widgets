import React from 'react';
import { connect } from 'react-redux';
import { Card } from 'react-bootstrap';

const SuggestedAmount = ({ data, isSelected, selectAmount, currency, forceMobileLayout }) => {
  const label = `${currency.code} ${currency.symbol}${data.amount}`;

  const cardClassName = forceMobileLayout ? 'mx-1 mb-2' : 'mx-1 mb-2 mb-md-0';
  const imageClassName = forceMobileLayout ? 'd-none' : 'd-none d-md-block';

  return (
    <Card
      className={cardClassName}
      style={{ cursor: 'pointer' }}
      bg={isSelected ? 'primary' : 'light'}
      text={isSelected ? 'white' : null}
      onClick={() => selectAmount(data.amount)}
      data-testid={`amount-${data.amount}`}
    >
      <Card.Img src={data.image} variant="top" className={imageClassName} />
      <Card.Body>
        <Card.Title className="mb-2">{label}</Card.Title>
        <Card.Text>{data.desc}</Card.Text>
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
