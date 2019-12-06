import React from 'react';
import { connect } from 'react-redux';
import { Form, Card, InputGroup } from 'react-bootstrap';
import { cleanDecimal } from 'form/utils';

const _VariableAmountLg = ({ amountInfo, value, isSelected, onChange, onHover, currency, forceMd }) => {
  let input = React.createRef();

  let cardClassName = 'mx-1 d-none';
  if (!forceMd) cardClassName += ' d-lg-block';

  return (
    <Card
      className={cardClassName}
      style={{ cursor: 'pointer' }}
      bg={isSelected ? 'info' : 'light'}
      text={isSelected ? 'white' : null}
      onClick={() => input.current.focus()}
    >
      <Card.Img src={amountInfo.image} variant="top" />
      <Card.Body>
        <Card.Title className="mb-2">{amountInfo.title}</Card.Title>
        <Card.Text>{amountInfo.description}</Card.Text>
        <div>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>{currency.symbol}</InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              placeholder="Other Amount"
              ref={input}
              value={value}
              type="text"
              onFocus={event => onChange(event.target.value)}
              onChange={event => onChange(cleanDecimal(event.target.value))}
              onMouseEnter={() => onHover(amountInfo)}
              data-testid="variable-amount-input"
            />
          </InputGroup>
        </div>
      </Card.Body>
    </Card>
  );
};

const mapStateToProps = state => {
  return {
    currency: state.settings.currency,
  }
};

export const VariableAmountLg = connect(mapStateToProps)(_VariableAmountLg);
