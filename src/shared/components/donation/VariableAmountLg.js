import React from 'react';
import { Form, Card, InputGroup } from 'react-bootstrap';
import { CurrencySymbol } from 'shared/components';
import { cleanDecimal } from 'form/utils';

export const VariableAmountLg = ({ value, amountInfo, isSelected, onChange }) => {
  let input = React.createRef();

  return (
    <Card
      className="mx-1 d-none d-lg-block variable-amount"
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
              <InputGroup.Text><CurrencySymbol /></InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              placeholder="Enter Amount"
              ref={input}
              value={value}
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
