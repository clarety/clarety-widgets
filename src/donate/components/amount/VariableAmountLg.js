import React from 'react';
import { connect } from 'react-redux';
import { Form, Card, InputGroup } from 'react-bootstrap';
import { cleanDecimal } from '../../../form/utils/payment-utils';

const VariableAmountLg = ({ value, amountInfo, isSelected, onChange, currency, forceMd }) => {
  let input = React.createRef();
  const label = `${currency.code}${currency.symbol}`;

  let cardClassName = 'mx-1 d-none';
  if (!forceMd) cardClassName += ' d-lg-block';

  return (
    <Card
      className={cardClassName}
      style={{ cursor: 'pointer' }}
      bg={isSelected ? 'primary' : 'light'}
      text={isSelected ? 'white' : null}
      onClick={() => input.current.focus()}
    >
      <Card.Img src={amountInfo.image} variant="top" />
      <Card.Body>
        <Card.Title className="mb-3">{amountInfo.description}</Card.Title>
        <Card.Text as="div">
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>{label}</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              required={isSelected}
              ref={input}
              value={value}
              className="text-right"
              type="text"
              onFocus={event => onChange(event.target.value)}
              onChange={event => onChange(cleanDecimal(event.target.value))}
              data-testid="variable-amount-input"
            />
          </InputGroup>
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

const mapStateToProps = state => {
  return {
    currency: state.explain.currency,
  }
};

export default connect(mapStateToProps)(VariableAmountLg);
