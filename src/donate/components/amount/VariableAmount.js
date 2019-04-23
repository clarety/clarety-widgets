import React from 'react';
import { connect } from 'react-redux';
import { Form, Card, InputGroup } from 'react-bootstrap';
import { cleanDecimal } from '../../../form/utils/payment-utils';

const VariableAmount = ({ value, amountInfo, isSelected, onChange, currency, forceMd }) => {
  let input = React.createRef();
  const label = `${currency.code}${currency.symbol}`;

  let cardClassName = 'flex-row mx-1 mb-2';
  if (!forceMd) cardClassName += ' d-lg-none';

  return (
    <Card
      className={cardClassName}
      style={{ cursor: 'pointer' }}
      bg={isSelected ? 'primary' : 'light'}
      text={isSelected ? 'white' : null}
      onClick={() => input.current.focus()}
    >
      <div style={{ width: '30%', background: `url(${amountInfo.image}) center center / cover`}}></div>
      <Card.Body style={{ width: '70%' }}>
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

export default connect(mapStateToProps)(VariableAmount);
