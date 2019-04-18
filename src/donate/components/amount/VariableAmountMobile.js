import React from 'react';
import { connect } from 'react-redux';
import { Form, Card, InputGroup, Image } from 'react-bootstrap';
import { cleanDecimal } from '../../../form/utils/payment-utils';

const VariableAmountMobile = ({ value, amountInfo, isSelected, onChange, currency, forceMobileLayout }) => {
  let input = React.createRef();
  const label = `${currency.code}${currency.symbol}`;

  let cardClassName = 'flex-row mx-1';
  if (!forceMobileLayout) cardClassName += ' d-lg-none';

  return (
    <Card
      className={cardClassName}
      style={{ cursor: 'pointer' }}
      bg={isSelected ? 'primary' : 'light'}
      text={isSelected ? 'white' : null}
      onClick={() => input.current.focus()}
    >
      <Image src={amountInfo.image} />
      <Card.Body>
        <Card.Title className="mb-3">{amountInfo.desc}</Card.Title>
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

export default connect(mapStateToProps)(VariableAmountMobile);
